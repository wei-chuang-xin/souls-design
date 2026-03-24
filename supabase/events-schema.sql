-- souls.design 用户行为埋点表
-- 创建时间：2026-03-24

create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  event_name  text not null,
  user_id     text,                    -- 登录用户ID，匿名时为 null
  session_id  text,                    -- 浏览器随机 session 标识
  soul_slug   text,                    -- 相关商品 slug，无关时为 null
  locale      text,                    -- zh / en
  referrer    text,                    -- document.referrer
  properties  jsonb default '{}',      -- 扩展字段
  created_at  timestamptz not null default now()
);

create index if not exists idx_events_event_name  on events(event_name);
create index if not exists idx_events_user_id     on events(user_id);
create index if not exists idx_events_soul_slug   on events(soul_slug);
create index if not exists idx_events_created_at  on events(created_at desc);

-- 事件名约定：
-- page_view          任意页面加载
-- product_view       商品详情页打开
-- cta_click          点击购买/下载/登录按钮（properties.cta_type: buy|download|signin）
-- checkout_started   PayPal 弹窗打开
-- payment_success    支付成功
-- payment_failed     支付失败或取消（properties.reason: failed|cancelled）
