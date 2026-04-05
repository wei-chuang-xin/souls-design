# souls.design 技术架构总览

> 从零到 MVP：Google 登录 + PayPal 支付 + 付费商品下载

## 项目概述

**souls.design** 是一个 AI Agent 资源市场，支持免费和付费商品的展示、购买和下载。

**核心功能：**
- Google OAuth 登录
- PayPal 支付集成
- 混合付费模式（Free / Premium / Bundle）
- 权限控制和下载管理

---

## 技术栈

### 前端
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **next-intl** (国际化)

### 后端
- **Next.js API Routes**
- **Auth.js v5** (JWT Session)
- **Supabase** (PostgreSQL + RLS)

### 第三方服务
- **Google OAuth** (用户认证)
- **PayPal** (支付处理)
- **Vercel** (部署和托管)

---

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                         用户浏览器                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  商品列表页   │  │  商品详情页   │  │  个人中心页   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Server Components (SSR)                             │   │
│  │  - 商品数据获取                                        │   │
│  │  - 用户认证状态                                        │   │
│  │  - 权限验证                                           │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Client Components                                   │   │
│  │  - PayPal 按钮                                        │   │
│  │  - 下载按钮                                           │   │
│  │  - 交互逻辑                                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Routes                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ /api/auth/*  │  │ /api/paypal/*│  │/api/download/*│      │
│  │ (Auth.js)    │  │ (支付处理)    │  │ (文件下载)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Google     │    │   PayPal     │    │  Supabase    │
│   OAuth      │    │   REST API   │    │  PostgreSQL  │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 数据库设计

### users 表
```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  avatar_url text,
  provider text,
  created_at timestamptz default now()
);
```

### purchases 表
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
```

### downloads 表
```sql
create table downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) not null,
  item_slug text not null,
  downloaded_at timestamptz default now()
);
```

### RLS 策略
```sql
-- 用户只能查看自己的购买记录
create policy "Users can view own purchases"
  on purchases for select
  using (auth.uid() = user_id);

-- 用户只能查看自己的下载记录
create policy "Users can view own downloads"
  on downloads for select
  using (auth.uid() = user_id);
```

---

## 核心流程

### 1. 用户登录流程

```
用户点击登录
    ↓
跳转到 Google OAuth
    ↓
用户授权
    ↓
回调到 /api/auth/callback/google
    ↓
Auth.js 验证 token
    ↓
signIn callback: 同步用户到 Supabase
    ↓
jwt callback: 将 Supabase UUID 存入 token
    ↓
session callback: 将 UUID 传递到 session
    ↓
设置 Cookie (JWT)
    ↓
登录完成
```

### 2. 支付流程

```
用户点击 "Buy now"
    ↓
前端调用 /api/paypal/create-order
    ↓
后端获取 PayPal Access Token
    ↓
后端调用 PayPal API 创建订单
    ↓
返回 orderId 给前端
    ↓
PayPal SDK 弹出支付窗口
    ↓
用户完成支付
    ↓
前端调用 /api/paypal/capture-order
    ↓
后端调用 PayPal API 捕获订单
    ↓
验证支付状态 (COMPLETED)
    ↓
写入 purchases 表
    ↓
返回成功
    ↓
前端刷新页面，显示 "Download" 按钮
```

### 3. 下载流程

```
用户点击 "Download"
    ↓
前端调用 fetch('/api/download/xxx', { credentials: 'include' })
    ↓
后端验证 session (JWT Cookie)
    ↓
检查权限:
  - 免费商品: 直接允许
  - 付费商品: 查询 purchases 表
    ↓
权限验证通过
    ↓
记录下载到 downloads 表
    ↓
动态生成 ZIP 文件:
  - 添加 README.md
  - 添加 SKILL.md (如果是 skill)
    ↓
返回 ZIP 文件流
    ↓
浏览器自动下载
```

---

## 关键技术决策

### 1. JWT Session vs Database Session

**选择：JWT Session**

**理由：**
- 无需数据库存储 session
- 性能更好（无需查询）
- 部署简单（无状态）
- 适合小型项目

**权衡：**
- 无法主动撤销 session
- Token 体积较大

### 2. Server-Side Payment Capture

**选择：后端捕获支付**

**理由：**
- 安全：Client Secret 不暴露
- 可靠：后端验证支付状态
- 可控：写库前可做额外验证

### 3. 动态 ZIP 生成 vs 预存文件

**选择：动态生成**

**理由：**
- 节省存储空间
- 灵活：可以根据版本动态生成
- 简单：无需管理文件上传

**权衡：**
- 每次下载都要生成（性能开销）
- 适合小文件，不适合大文件

### 4. RLS vs Application-Level 权限控制

**选择：RLS (Row Level Security)**

**理由：**
- 数据库层面保护
- 即使代码有漏洞，数据也安全
- Supabase 原生支持

---

## 性能优化

### 已实现
- Server Components (SSR)
- 静态数据缓存
- JWT Session (无数据库查询)

### 待优化
- 图片懒加载
- ZIP 文件缓存
- CDN 加速

---

## 安全措施

### 认证安全
- JWT Token 加密
- AUTH_SECRET 随机生成
- Cookie HttpOnly + Secure

### 支付安全
- Client Secret 后端专用
- 后端验证支付状态
- 防重复支付（唯一约束）

### 数据安全
- Supabase RLS 策略
- Service Role Key 后端专用
- 用户只能访问自己的数据

---

## 部署架构

```
GitHub (代码仓库)
    ↓ (git push)
Vercel (自动部署)
    ↓
生产环境
    ├── Next.js App (Edge Functions)
    ├── API Routes (Serverless Functions)
    └── Static Assets (CDN)
    
外部服务
    ├── Supabase (数据库)
    ├── Google OAuth (认证)
    └── PayPal (支付)
```

**优点：**
- 自动部署（git push 即上线）
- 全球 CDN 加速
- 无需管理服务器
- 按需扩展

---

## 监控和日志

### 当前状态
- Vercel 部署日志
- Supabase 查询日志
- 浏览器 Console 日志

### 待完善
- 错误追踪（Sentry）
- 性能监控（Vercel Analytics）
- 用户行为分析（Google Analytics）

---

## 成本估算

### 开发阶段（沙箱）
- Vercel: 免费
- Supabase: 免费
- Google OAuth: 免费
- PayPal 沙箱: 免费

**总成本：$0/月**

### 生产环境（预估）
- Vercel Pro: $20/月
- Supabase Pro: $25/月
- PayPal 手续费: 2.9% + $0.30/笔

**固定成本：$45/月**
**变动成本：按交易量**

---

## 技术债务

### P0（必须解决）
- [ ] 错误处理和用户提示
- [ ] 支付失败重试机制
- [ ] 下载失败处理

### P1（应该解决）
- [ ] 移动端优化
- [ ] SEO 优化
- [ ] 性能监控

### P2（可以延后）
- [ ] 多语言支持完善
- [ ] 暗黑模式
- [ ] PWA 支持

---

## 扩展性考虑

### 水平扩展
- Vercel 自动扩展
- Supabase 支持扩展
- 无状态设计（JWT）

### 功能扩展
- 支持更多支付方式（Stripe, 支付宝）
- 支持订阅制
- 支持创作者分成
- 支持优惠券和促销

### 数据扩展
- 商品数据可迁移到 CMS
- 用户数据可迁移到专用数据库
- 文件存储可迁移到 S3

---

## 关键经验总结

### 1. 认证集成
- JWT Session 比 Database Session 更简单
- 必须在 jwt callback 中同步 Supabase UUID
- Cookie 跨域问题用 `credentials: 'include'` 解决

### 2. 支付集成
- 必须后端验证支付状态
- 金额用整数存储（避免浮点数精度问题）
- 防重复支付（唯一约束 + 幂等性检查）

### 3. 文件下载
- 用 `fetch` + `credentials: 'include'` 发起认证请求
- JSZip 使用 `arraybuffer` 类型
- 动态生成适合小文件，大文件需要预存

### 4. 部署和运维
- Vercel 环境变量必须配置完整
- TypeScript 类型错误会导致部署失败
- 沙箱测试通过后再上生产

---

## 参考文档

- [Google OAuth 集成指南](./google-oauth-integration.md)
- [PayPal 支付集成指南](./paypal-integration.md)
- [混合付费产品方案](./mixed-paid-product-plan.md)
- [项目进度](./PROGRESS.md)

---

*最后更新：2026-04-05*
*作者：阿图*
