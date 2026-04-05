# Google OAuth 集成指南

> 基于 Auth.js v5 + Next.js 16 的 Google 登录实现

## 概述

本文档记录了在 souls.design 项目中集成 Google OAuth 的完整过程，包括配置、实现和踩坑经验。

---

## 技术栈

- **Auth.js v5** (next-auth@beta)
- **Next.js 16** (App Router)
- **JWT Session** (无需数据库)
- **Supabase** (用户数据存储)

---

## 1. Google Cloud Console 配置

### 1.1 创建 OAuth 2.0 凭据

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建或选择项目
3. 启用 "Google+ API"
4. 创建 OAuth 2.0 客户端 ID：
   - 应用类型：Web 应用
   - 授权重定向 URI：
     - 开发环境：`http://localhost:3000/api/auth/callback/google`
     - 生产环境：`https://souls.design/api/auth/callback/google`

### 1.2 获取凭据

- **Client ID**: `403407073485-047rju2s6v418nqmasd3u4nafnrpppc8.apps.googleusercontent.com`
- **Client Secret**: (存储在环境变量中)

---

## 2. 项目配置

### 2.1 安装依赖

```bash
npm install next-auth@beta @auth/core
```

### 2.2 环境变量 (.env.local)

```bash
# Auth.js
AUTH_SECRET="your-random-secret-here"  # 使用 openssl rand -base64 32 生成
AUTH_GOOGLE_ID="403407073485-047rju2s6v418nqmasd3u4nafnrpppc8.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 2.3 Vercel 环境变量

在 Vercel Dashboard 中配置相同的环境变量，确保生产环境可用。

---

## 3. 代码实现

### 3.1 Auth.js 配置 (auth.ts)

```typescript
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',  // 使用 JWT，无需数据库
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      // 同步用户到 Supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single()

      if (!existingUser) {
        await supabase.from('users').insert({
          email: user.email,
          name: user.name,
          avatar_url: user.image,
          provider: account?.provider,
        })
      }

      return true
    },
    async jwt({ token, user, account }) {
      // 首次登录时，将 Supabase user id 存入 token
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email!)
          .single()

        if (data) {
          token.sub = data.id  // 使用 Supabase UUID
        }
      }
      return token
    },
    async session({ session, token }) {
      // 将 Supabase user id 传递到 session
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
})
```

### 3.2 API Route (app/api/auth/[...nextauth]/route.ts)

```typescript
import { handlers } from '@/auth'

export const { GET, POST } = handlers
```

### 3.3 登录按钮组件

```typescript
'use client'

import { signIn, signOut } from 'next-auth/react'

export function SignInButton() {
  return (
    <button onClick={() => signIn('google')}>
      Sign in with Google
    </button>
  )
}

export function SignOutButton() {
  return (
    <button onClick={() => signOut()}>
      Sign out
    </button>
  )
}
```

### 3.4 获取当前用户

```typescript
import { auth } from '@/auth'

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}
```

---

## 4. 关键决策

### 4.1 为什么选择 JWT Session？

**优点：**
- 无需数据库存储 session
- 性能更好（无需查询数据库）
- 部署简单（无状态）

**缺点：**
- 无法主动撤销 session（需等待 token 过期）
- Token 体积较大

**结论：** 对于 souls.design 这种小型项目，JWT 更合适。

### 4.2 为什么同步用户到 Supabase？

虽然使用 JWT Session，但仍需要：
- 存储用户的购买记录
- 关联用户和订单
- 实现 RLS 权限控制

因此在 `signIn` callback 中同步用户数据到 Supabase。

---

## 5. 踩坑记录

### 5.1 @auth/supabase-adapter 不兼容

**问题：** `@auth/supabase-adapter` 与 `next-auth@beta` 不兼容。

**解决方案：** 使用 JWT Session + 手动同步用户数据。

### 5.2 session.user.id 为空

**问题：** 默认情况下，`session.user.id` 是 Google 的 sub，不是 Supabase 的 UUID。

**解决方案：** 在 `jwt` callback 中查询 Supabase，将 UUID 存入 `token.sub`。

```typescript
async jwt({ token, user }) {
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email!)
      .single()

    if (data) {
      token.sub = data.id  // 覆盖为 Supabase UUID
    }
  }
  return token
}
```

### 5.3 Vercel 部署后 AUTH_SECRET 不生效

**问题：** 本地正常，Vercel 部署后登录失败。

**原因：** 环境变量未配置或格式错误。

**解决方案：**
1. 在 Vercel Dashboard 中配置所有环境变量
2. 确保 `AUTH_SECRET` 是 base64 编码的随机字符串
3. 重新部署

### 5.4 Cookie 跨域问题

**问题：** 下载 API 无法获取 session。

**原因：** 浏览器默认不发送跨域 Cookie。

**解决方案：** 使用 `fetch` 时添加 `credentials: 'include'`。

```typescript
const response = await fetch('/api/download/xxx', {
  credentials: 'include',
})
```

---

## 6. 测试清单

- [ ] 本地开发环境登录
- [ ] Vercel 生产环境登录
- [ ] 首次登录创建用户
- [ ] 重复登录不重复创建
- [ ] session.user.id 正确（Supabase UUID）
- [ ] 登出功能正常
- [ ] Cookie 在 API 路由中可用

---

## 7. 安全建议

1. **AUTH_SECRET 必须随机生成**：
   ```bash
   openssl rand -base64 32
   ```

2. **不要在客户端暴露 SUPABASE_SERVICE_ROLE_KEY**：
   - 只在服务端使用
   - 使用 `NEXT_PUBLIC_` 前缀的变量会暴露到客户端

3. **限制 Google OAuth 重定向 URI**：
   - 只添加信任的域名
   - 避免使用通配符

4. **定期轮换密钥**：
   - AUTH_SECRET
   - Google Client Secret
   - Supabase Service Role Key

---

## 8. 参考资料

- [Auth.js 官方文档](https://authjs.dev/)
- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
- [Next.js App Router 认证](https://nextjs.org/docs/app/building-your-application/authentication)

---

*最后更新：2026-04-05*
*作者：阿图*
