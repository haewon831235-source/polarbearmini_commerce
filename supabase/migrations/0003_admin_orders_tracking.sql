-- Admin dashboard backing tables (Phase B):
--   * shop_order / order_item : persist EVERY payment attempt (started/paid/
--     failed/error) so the admin can see payment progress + failure reasons.
--   * page_view               : first-party visitor logging (not PostHog).
--   * admin_user              : allowlist of Supabase auth users who may sign
--     into /admin.
--
-- Idempotent (create ... if not exists) — db-setup re-applies every migration
-- on each run. Append-only: never edit 0001/0002.
--
-- RLS: these tables get NO public policies. Only the service_role key (which
-- bypasses RLS) can read/write them. The app gates access with requireAdmin()
-- and performs all reads/writes through the server-side service client. anon /
-- authenticated roles are denied by default (RLS on, zero matching policies).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Orders — one row per payment ATTEMPT (not just successful orders). This is
-- what makes "결제 오류 여부" observable: failures/errors are recorded too.
-- ---------------------------------------------------------------------------
create table if not exists shop_order (
  id             uuid primary key default gen_random_uuid(),
  payment_id     text not null unique,                 -- PortOne paymentId "order-<uuid>"
  status         text not null default 'started'
                   check (status in ('started', 'paid', 'failed', 'error')),
  error_reason   text,                                 -- empty-cart | lookup-failed | lookup-error | verification-failed | sdk-cancel | sdk-failure
  order_name     text,
  amount_minor   bigint check (amount_minor >= 0),     -- smallest currency unit (KRW/JPY exp 0)
  currency       text,                                 -- KRW | JPY | USD | CNY
  locale         text,                                 -- ko | en | ja | zh
  customer_name  text,
  customer_email text,
  customer_phone text,
  pg_status      text,                                 -- raw PortOne status, when available
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists shop_order_status_idx  on shop_order (status);
create index if not exists shop_order_created_idx on shop_order (created_at desc);

-- Cart line snapshot at attempt time. Denormalized (no FK to product) so the
-- order history survives later catalog edits/deletes.
create table if not exists order_item (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references shop_order (id) on delete cascade,
  handle            text not null,
  variant_id        text,
  title             text not null,
  variant_label     text,
  unit_amount_minor bigint not null default 0,
  qty               int not null check (qty > 0),
  line_total_minor  bigint not null default 0
);

create index if not exists order_item_order_idx on order_item (order_id);

-- ---------------------------------------------------------------------------
-- Visitor log — first-party page views (independent of PostHog).
-- ---------------------------------------------------------------------------
create table if not exists page_view (
  id         uuid primary key default gen_random_uuid(),
  visitor_id text,                                     -- long-lived cookie (pbm_vid)
  session_id text,                                     -- session cookie (pbm_sid)
  path       text not null,
  locale     text,
  referrer   text,
  country    text,                                     -- x-vercel-ip-country
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists page_view_created_idx on page_view (created_at desc);
create index if not exists page_view_visitor_idx on page_view (visitor_id);

-- ---------------------------------------------------------------------------
-- Admin allowlist — only these auth.users may enter /admin (checked in
-- requireAdmin() via the service client after auth.getUser()).
-- ---------------------------------------------------------------------------
create table if not exists admin_user (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security: NO public policies. service_role bypasses RLS; everyone
-- else is denied. (Contrast with the catalog tables, which are anon-readable.)
-- ---------------------------------------------------------------------------
alter table shop_order enable row level security;
alter table order_item enable row level security;
alter table page_view  enable row level security;
alter table admin_user enable row level security;
