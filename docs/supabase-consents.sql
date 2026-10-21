-- ============================================================
--  ZGODY PRZY ZAKUPIE PRODUKTU CYFROWEGO
--  Wklej w: Supabase → SQL Editor → New query → Run
--  Skrypt idempotentny.
-- ============================================================

-- Każdy zakup = jeden wiersz; zapisujemy DATĘ i PEŁNĄ TREŚĆ zaakceptowanych zgód
-- (oraz ich wersje), aby dało się je później odtworzyć / udowodnić.
create table if not exists public.order_consents (
  id                       bigint generated always as identity primary key,
  stripe_session_id        text unique,
  user_email               text not null,
  product                  text not null default 'online',

  -- Zgoda: akceptacja regulaminu i polityki prywatności
  terms_accepted           boolean not null default false,
  terms_text               text,
  terms_version            text,
  terms_accepted_at        timestamptz,

  -- Zgoda: natychmiastowy dostęp + skutki dla prawa odstąpienia
  immediate_access_accepted boolean not null default false,
  immediate_access_text     text,
  immediate_access_version  text,
  immediate_access_at       timestamptz,

  created_at               timestamptz not null default now()
);

create index if not exists order_consents_email_idx
  on public.order_consents (user_email);
create index if not exists order_consents_session_idx
  on public.order_consents (stripe_session_id);

alter table public.order_consents enable row level security;
-- (brak polityk = anon/authenticated brak dostępu; service role omija RLS)

-- ============================================================
--  KONIEC
-- ============================================================
