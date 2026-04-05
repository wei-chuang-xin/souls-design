# Supabase RLS 策略配置

> Row Level Security 配置文档

## 概述

本文档记录了 souls.design 项目的 Supabase RLS 策略配置，确保数据安全。

---

## 已启用 RLS 的表

- ✅ `users` - 用户表
- ✅ `purchases` - 购买记录表
- ✅ `downloads` - 下载记录表

---

## RLS 策略

### users 表

```sql
-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的信息
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 用户可以更新自己的信息
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Service role 可以插入用户（用于 OAuth 回调）
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  WITH CHECK (true);
```

### purchases 表

```sql
-- 启用 RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的购买记录
CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  USING (auth.uid()::text = user_id);

-- Service role 可以插入购买记录（用于支付回调）
CREATE POLICY "Service role can insert purchases"
  ON purchases FOR INSERT
  WITH CHECK (true);
```

### downloads 表

```sql
-- 启用 RLS
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的下载记录
CREATE POLICY "Users can view own downloads"
  ON downloads FOR SELECT
  USING (auth.uid()::text = user_id);

-- Service role 可以插入下载记录（用于下载 API）
CREATE POLICY "Service role can insert downloads"
  ON downloads FOR INSERT
  WITH CHECK (true);
```

---

## 类型转换说明

**重要：** `auth.uid()` 返回 `uuid` 类型，但我们的 `user_id` 字段是 `text` 类型，因此需要类型转换：

```sql
-- 错误（类型不匹配）
auth.uid() = user_id

-- 正确（转换为 text）
auth.uid()::text = user_id
```

---

## 验证 RLS 状态

### 检查哪些表启用了 RLS

```sql
SELECT tablename, rowsecurity as rls_enabled 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

### 查看所有策略

```sql
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

---

## 安全说明

### Service Role Key 的使用

后端 API 使用 `SUPABASE_SERVICE_ROLE_KEY` 来绕过 RLS，因此：

1. **永远不要在前端暴露 Service Role Key**
2. **只在服务端使用**（Next.js API Routes）
3. **定期轮换密钥**

### RLS 策略的作用

- **防止数据泄露**：即使代码有漏洞，数据库层面也会保护数据
- **用户隔离**：用户只能访问自己的数据
- **最小权限原则**：只授予必要的权限

---

## 常见问题

### Q: 为什么 Service Role 可以绕过 RLS？

A: Service Role 是数据库的超级用户，用于后端 API 操作。前端使用 anon key，会受到 RLS 限制。

### Q: 如何测试 RLS 是否生效？

A: 在 Supabase Dashboard 的 SQL Editor 中，切换到 "anon" 角色执行查询，应该看不到其他用户的数据。

### Q: 如果需要添加新表怎么办？

A: 按照以下步骤：
1. 创建表
2. 启用 RLS：`ALTER TABLE xxx ENABLE ROW LEVEL SECURITY;`
3. 添加策略（参考上面的示例）
4. 验证策略是否生效

---

## 执行命令

使用 Supabase CLI 执行 SQL：

```bash
cd /root/code/souls-design
export SUPABASE_ACCESS_TOKEN="your-token"
npx supabase db query --linked "YOUR SQL HERE"
```

---

*最后更新：2026-04-05*
*作者：阿图*
