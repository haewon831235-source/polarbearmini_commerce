-- Polar Bear Mini — goods catalog schema (Phase B).
-- Designed so a future ticketing module shares the same Order/Customer spine.
-- Translatable content lives in per-locale tables (not JSON blobs) so each
-- locale can be edited and indexed independently.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists product (
  id           uuid primary key default gen_random_uuid(),
  handle       text not null unique,                 -- URL slug, e.g. "aot-acrylic-stand"
  status       text not null default 'active'        -- active | draft | archived
                 check (status in ('active', 'draft', 'archived')),
  ip_franchise text,                                  -- e.g. "Attack on Titan" (brand grouping)
  image_url    text,                                  -- main image (Supabase Storage public URL)
  created_at   timestamptz not null default now()
);

create index if not exists product_status_idx on product (status);

-- Per-locale product copy. Falls back ko -> en in the app when a row is missing.
create table if not exists product_translation (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references product (id) on delete cascade,
  locale      text not null,                          -- ko | en | ja | zh
  title       text not null,
  subtitle    text,
  description text,
  seo_title   text,
  seo_desc    text,
  unique (product_id, locale)
);

-- Explicit price per currency (no auto FX conversion). amount_minor is in the
-- currency's smallest unit: KRW/JPY exponent 0, USD/CNY exponent 2.
create table if not exists product_price (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references product (id) on delete cascade,
  currency     text not null,                         -- KRW | JPY | USD | CNY
  amount_minor bigint not null check (amount_minor >= 0),
  unique (product_id, currency)
);

-- ---------------------------------------------------------------------------
-- Variants (size / color / etc.)
-- ---------------------------------------------------------------------------
create table if not exists product_variant (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references product (id) on delete cascade,
  sku        text unique,
  position   int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists variant_translation (
  id         uuid primary key default gen_random_uuid(),
  variant_id uuid not null references product_variant (id) on delete cascade,
  locale     text not null,
  label      text not null,                           -- e.g. "L" / "ブラック"
  unique (variant_id, locale)
);

-- ---------------------------------------------------------------------------
-- FX rates (display-only "approximate" conversion; charged price is the set price)
-- ---------------------------------------------------------------------------
create table if not exists fx_rate (
  base_currency  text not null,
  quote_currency text not null,
  rate           numeric not null,
  fetched_at     timestamptz not null default now(),
  primary key (base_currency, quote_currency)
);

-- ---------------------------------------------------------------------------
-- Row Level Security: catalog is publicly readable; writes are service-role only.
-- ---------------------------------------------------------------------------
alter table product             enable row level security;
alter table product_translation enable row level security;
alter table product_price        enable row level security;
alter table product_variant      enable row level security;
alter table variant_translation  enable row level security;
alter table fx_rate              enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'product','product_translation','product_price',
    'product_variant','variant_translation','fx_rate'
  ]
  loop
    execute format(
      'drop policy if exists %I on %I;', 'public_read_' || t, t
    );
    execute format(
      'create policy %I on %I for select to anon, authenticated using (true);',
      'public_read_' || t, t
    );
  end loop;
end $$;
