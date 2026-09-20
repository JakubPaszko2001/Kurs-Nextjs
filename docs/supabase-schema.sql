-- ============================================================
--  SCHEMAT BAZY SUPABASE — "Co zrobić, gdy druga połówka nie chce?"
--  Wklej CAŁOŚĆ w: Supabase → SQL Editor → New query → Run
--  Skrypt jest idempotentny (można uruchamiać wielokrotnie).
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABELA: users  (konta użytkowników + status dostępu)
--    Używana w: /api/login, /login, /checkout, /userpage, webhook
-- ------------------------------------------------------------
create table if not exists public.users (
  id          bigint generated always as identity primary key,
  email       text not null unique,
  password    text not null,                 -- UWAGA: w produkcji trzymaj HASH (bcrypt), nie plaintext!
  status      text not null default 'unpaid' -- 'unpaid' | 'paid'
                check (status in ('unpaid', 'paid')),
  created_at  timestamptz not null default now()
);

-- Indeks na email (przyspiesza logowanie i update po emailu w webhooku)
create index if not exists users_email_idx on public.users (email);

-- ------------------------------------------------------------
-- 2. TABELA: book_orders  (zamówienia książki fizycznej)
--    Używana w: /api/stripe/webhook (upsert po stripe_session_id)
-- ------------------------------------------------------------
create table if not exists public.book_orders (
  id                     bigint generated always as identity primary key,
  stripe_session_id      text not null unique,
  stripe_payment_intent  text,
  stripe_customer_id     text,

  email                  text,
  customer_name          text,
  customer_phone         text,

  shipping_method        text,               -- 'courier' | 'inpost'
  shipping_name          text,
  shipping_phone         text,
  shipping_address_line1 text,
  shipping_city          text,
  shipping_postal_code   text,
  shipping_country       text default 'PL',

  inpost_city            text,
  inpost_locker          text,

  qty                    integer default 1,
  amount_subtotal        integer,            -- w groszach
  amount_total           integer,            -- w groszach
  amount_shipping        integer,            -- w groszach
  currency               text default 'pln',
  status                 text default 'paid',

  created_at             timestamptz not null default now()
);

create index if not exists book_orders_session_idx on public.book_orders (stripe_session_id);
create index if not exists book_orders_email_idx   on public.book_orders (email);

-- ------------------------------------------------------------
-- 3. TABELA: partner_mailings  (harmonogram wysyłki rozdziałów)
--    Używana w: /api/partner-mail/schedule i /api/partner-mail/cron
-- ------------------------------------------------------------
create table if not exists public.partner_mailings (
  id              bigint generated always as identity primary key,
  user_email      text not null,
  partner_email   text not null,
  cadence_days    integer not null default 3,
  current_chapter integer not null default 1,
  next_send_at    timestamptz not null default now(),
  status          text not null default 'active'  -- 'active' | 'finished'
                    check (status in ('active', 'finished')),
  created_at      timestamptz not null default now()
);

create index if not exists partner_mailings_status_idx on public.partner_mailings (status, next_send_at);

-- ============================================================
--  USTAWIENIA BEZPIECZEŃSTWA (Row Level Security)
-- ============================================================
-- Aplikacja używa:
--  • supabaseAdmin (SERVICE ROLE KEY) — omija RLS, używa go logowanie i webhook,
--  • supabase (ANON/PUBLISHABLE KEY) — używany w kliencie przy rejestracji.
--
-- Aby rejestracja z przeglądarki działała, włączamy RLS na "users"
-- i pozwalamy anonimowemu użytkownikowi TYLKO na INSERT (rejestracja).
-- Odczyt/update robi wyłącznie service role (logowanie, webhook).

alter table public.users            enable row level security;
alter table public.book_orders      enable row level security;
alter table public.partner_mailings enable row level security;

-- users: anon może się zarejestrować (INSERT), nie może czytać/zmieniać
drop policy if exists "anon can register" on public.users;
create policy "anon can register"
  on public.users
  for insert
  to anon
  with check (true);

-- book_orders i partner_mailings: dostęp wyłącznie przez service role.
-- (brak polityk = anon/authenticated nic nie mogą — service role i tak omija RLS)

-- ============================================================
--  DANE TESTOWE — konto, którym możesz się zalogować od razu
--  login: test@test.pl   hasło: test123
-- ============================================================
insert into public.users (email, password, status)
values ('test@test.pl', 'test123', 'paid')
on conflict (email) do update
  set password = excluded.password,
      status   = excluded.status;

-- ============================================================
--  KONIEC
-- ============================================================
