# PayPal 支付集成指南

> 基于 PayPal JavaScript SDK + Next.js API Routes 的支付实现

## 概述

本文档记录了在 souls.design 项目中集成 PayPal 支付的完整过程，包括沙箱配置、前后端实现和踩坑经验。

---

## 技术栈

- **PayPal JavaScript SDK** (前端)
- **PayPal REST API** (后端)
- **Next.js 16 API Routes**
- **Supabase** (订单存储)

---

## 1. PayPal Developer 配置

### 1.1 创建沙箱应用

1. 访问 [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. 创建应用（Sandbox 模式）
3. 获取凭据：
   - **Client ID**: `AaGUbH8...` (用于前端)
   - **Client Secret**: `EJZ...` (用于后端，保密)

### 1.2 创建沙箱测试账号

PayPal 自动创建两个测试账号：
- **商家账号**：接收付款
- **买家账号**：用于测试购买

**测试买家账号：**
- Email: `sb-ayfhl50019778@personal.example.com`
- Password: `zLV4_#]O`

---

## 2. 项目配置

### 2.1 环境变量 (.env.local)

```bash
# PayPal Sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID="AaGUbH8..."  # 前端可见
PAYPAL_CLIENT_SECRET="EJZ..."              # 后端专用，保密
PAYPAL_API_BASE="https://api-m.sandbox.paypal.com"  # 沙箱环境
```

### 2.2 生产环境切换

切换到生产环境时，只需修改：
```bash
PAYPAL_API_BASE="https://api-m.paypal.com"  # 生产环境
```

并使用生产环境的 Client ID 和 Secret。

---

## 3. 数据库设计

### 3.1 purchases 表

```sql
create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) not null,
  item_slug text not null,
  amount_cents integer not null,
  currency text not null default 'usd',
  paypal_order_id text unique not null,
  status text not null default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 索引
create index idx_purchases_user_id on purchases(user_id);
create index idx_purchases_item_slug on purchases(item_slug);
create index idx_purchases_paypal_order_id on purchases(paypal_order_id);

-- RLS 策略
alter table purchases enable row level security;

create policy "Users can view own purchases"
  on purchases for select
  using (auth.uid() = user_id);
```

---

## 4. 后端实现

### 4.1 创建订单 API (app/api/paypal/create-order/route.ts)

```typescript
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE!
const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!

async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  
  const data = await response.json()
  return data.access_token
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { itemSlug, amountCents, currency = 'USD' } = await request.json()

  const accessToken = await getAccessToken()

  const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: (amountCents / 100).toFixed(2),
        },
        description: `Purchase ${itemSlug}`,
      }],
    }),
  })

  const order = await orderResponse.json()
  return NextResponse.json({ orderId: order.id })
}
```

### 4.2 捕获订单 API (app/api/paypal/capture-order/route.ts)

```typescript
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { orderId, itemSlug, amountCents, currency } = await request.json()

  const accessToken = await getAccessToken()

  // 捕获支付
  const captureResponse = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  )

  const captureData = await captureResponse.json()

  // 验证支付状态
  if (captureData.status !== 'COMPLETED') {
    return NextResponse.json(
      { error: 'payment_failed', details: captureData },
      { status: 400 }
    )
  }

  // 写入数据库
  const { error } = await supabase.from('purchases').insert({
    user_id: session.user.id,
    item_slug: itemSlug,
    amount_cents: amountCents,
    currency: currency.toLowerCase(),
    paypal_order_id: orderId,
    status: 'completed',
  })

  if (error) {
    console.error('Failed to record purchase:', error)
    return NextResponse.json({ error: 'database_error' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
```

---

## 5. 前端实现

### 5.1 加载 PayPal SDK

在 `app/layout.tsx` 中添加：

```typescript
<Script
  src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}
  strategy="lazyOnload"
/>
```

### 5.2 支付按钮组件

```typescript
'use client'

import { useEffect, useRef } from 'react'

export function PayPalButton({ itemSlug, amountCents, onSuccess }) {
  const paypalRef = useRef(null)

  useEffect(() => {
    if (!window.paypal) return

    window.paypal.Buttons({
      createOrder: async () => {
        const response = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemSlug, amountCents, currency: 'USD' }),
        })
        const { orderId } = await response.json()
        return orderId
      },
      onApprove: async (data) => {
        const response = await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: data.orderID,
            itemSlug,
            amountCents,
            currency: 'USD',
          }),
        })
        
        if (response.ok) {
          onSuccess()
        }
      },
    }).render(paypalRef.current)
  }, [itemSlug, amountCents, onSuccess])

  return <div ref={paypalRef} />
}
```

---

## 6. 关键决策

### 6.1 为什么使用 Server-Side Capture？

**优点：**
- 安全：Client Secret 不暴露到前端
- 可靠：后端验证支付状态
- 可控：可以在写库前做额外验证

**缺点：**
- 需要额外的 API 路由

**结论：** 安全性优先，必须使用后端捕获。

### 6.2 为什么先捕获再写库？

**流程：**
1. 前端调用 `create-order`
2. 用户在 PayPal 弹窗中完成支付
3. 前端调用 `capture-order`
4. 后端验证支付状态（COMPLETED）
5. 写入 `purchases` 表

**原因：**
- 避免未支付的订单写入数据库
- 确保数据一致性

---

## 7. 踩坑记录

### 7.1 Access Token 获取失败

**问题：** 401 Unauthorized

**原因：** Client ID 或 Secret 错误，或者使用了生产凭据访问沙箱环境。

**解决方案：**
- 确认使用沙箱凭据
- 检查 `PAYPAL_API_BASE` 是否正确

### 7.2 订单捕获失败

**问题：** `capture-order` 返回 `INSTRUMENT_DECLINED`

**原因：** 沙箱买家账号余额不足。

**解决方案：**
- 在 PayPal Developer Dashboard 中给测试账号充值
- 或创建新的测试买家账号

### 7.3 重复支付问题

**问题：** 用户刷新页面后重复调用 `capture-order`。

**解决方案：**
- 在 `purchases` 表中添加 `paypal_order_id` 唯一约束
- 捕获前检查订单是否已存在

```typescript
const { data: existing } = await supabase
  .from('purchases')
  .select('id')
  .eq('paypal_order_id', orderId)
  .single()

if (existing) {
  return NextResponse.json({ success: true, alreadyProcessed: true })
}
```

### 7.4 金额精度问题

**问题：** JavaScript 浮点数精度问题（0.1 + 0.2 = 0.30000000000000004）

**解决方案：**
- 数据库存储 `amount_cents`（整数）
- 传给 PayPal 时转换：`(amountCents / 100).toFixed(2)`

---

## 8. 测试流程

### 8.1 沙箱测试

1. 访问商品页面
2. 点击 "Buy now"
3. 在 PayPal 弹窗中登录测试买家账号
4. 完成支付
5. 验证：
   - `purchases` 表有记录
   - `status = 'completed'`
   - 可以下载商品

### 8.2 生产环境上线前检查

- [ ] 切换到生产 API Base
- [ ] 使用生产 Client ID 和 Secret
- [ ] 测试真实支付（小额）
- [ ] 验证 Webhook（可选）
- [ ] 配置退款流程

---

## 9. 安全建议

1. **永远不要在前端暴露 Client Secret**
2. **后端验证支付状态**：不要信任前端传来的状态
3. **使用 HTTPS**：PayPal 要求生产环境必须 HTTPS
4. **记录所有交易**：便于对账和排查问题
5. **实现 Webhook**：处理异步通知（退款、争议等）

---

## 10. 生产环境切换清单

- [ ] 更新 `PAYPAL_API_BASE` 为生产 URL
- [ ] 使用生产 Client ID 和 Secret
- [ ] 在 PayPal Dashboard 中配置 Webhook URL
- [ ] 测试真实支付流程
- [ ] 配置退款和争议处理流程
- [ ] 添加支付失败的用户提示
- [ ] 实现订单查询功能

---

## 11. 参考资料

- [PayPal JavaScript SDK](https://developer.paypal.com/sdk/js/)
- [PayPal REST API](https://developer.paypal.com/api/rest/)
- [PayPal Webhooks](https://developer.paypal.com/api/rest/webhooks/)

---

*最后更新：2026-04-05*
*作者：阿图*
