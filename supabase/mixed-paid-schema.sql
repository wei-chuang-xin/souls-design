-- souls.design mixed paid MVP schema

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  provider text not null default 'paypal',
  external_order_id text,
  status text not null default 'pending',
  total_amount_cents integer not null,
  currency text not null default 'usd',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  soul_slug text not null,
  order_id uuid references orders(id) on delete set null,
  provider text not null default 'paypal',
  status text not null default 'paid',
  amount_cents integer,
  currency text default 'usd',
  purchased_at timestamptz not null default now()
);

create index if not exists idx_purchases_user_id on purchases(user_id);
create index if not exists idx_purchases_soul_slug on purchases(soul_slug);
create unique index if not exists uniq_purchases_user_soul_paid on purchases(user_id, soul_slug, status);
