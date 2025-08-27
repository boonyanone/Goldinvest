create extension if not exists pgcrypto;

do $$ begin
  create type session_t as enum ('ASIA','EUROPE','US');
exception when duplicate_object then null; end $$;

do $$ begin
  create type zone_t as enum ('MAIN','BACKUP');
exception when duplicate_object then null; end $$;

do $$ begin
  create type result_t as enum ('WIN','LOSE','BE');
exception when duplicate_object then null; end $$;

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  plan_date date not null,
  session session_t not null,
  zone_type zone_t not null,
  buy_low numeric,
  buy_high numeric,
  tp_low numeric,
  tp_high numeric,
  sl numeric,
  confidence int,
  conditions text[],
  hist_win_rate numeric,
  hist_avg_pnl numeric,
  hist_max_dd numeric,
  note text,
  created_at timestamptz default now()
);

create table if not exists executions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references plans(id) on delete cascade,
  entry_price numeric,
  exit_price numeric,
  pnl_usd numeric,
  hit_tp boolean,
  hit_sl boolean,
  mfe numeric,
  mae numeric,
  used_conditions text[],
  news_context text,
  confidence_used int,
  result result_t,
  closed_at timestamptz,
  created_at timestamptz default now()
);
