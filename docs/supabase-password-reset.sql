-- ============================================================
--  RESET HASŁA („Nie pamiętam hasła")
--  Wklej w: Supabase → SQL Editor → New query → Run
--  Skrypt idempotentny.
-- ============================================================

-- ------------------------------------------------------------
-- Tabela: password_resets
--   • jeden wiersz = jedno żądanie resetu
--   • token to losowy sekret w linku; trzymamy tylko jego HASH,
--     żeby wyciek bazy nie pozwalał przejąć konta.
--   • token jest jednorazowy i wygasa (used_at / expires_at)
-- ------------------------------------------------------------
create table if not exists public.password_resets (
  id           bigint generated always as identity primary key,
  user_email   text not null,
  token_hash   text not null unique,
  expires_at   timestamptz not null,
  used_at      timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists password_resets_email_idx
  on public.password_resets (user_email);
create index if not exists password_resets_hash_idx
  on public.password_resets (token_hash);

-- RLS: dostęp tylko przez service role (API routes). Anon brak dostępu.
alter table public.password_resets enable row level security;
-- (brak polityk = anon/authenticated nic nie mogą; service role omija RLS)

-- ============================================================
--  KONIEC
-- ============================================================
