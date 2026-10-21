-- ============================================================
--  ZAPROSZENIA „Udostępnij drugiej osobie bezpłatnie”
--  Wklej w: Supabase → SQL Editor → New query → Run
--  Skrypt idempotentny.
-- ============================================================

-- ------------------------------------------------------------
-- Tabela: share_invites
--   • jeden wiersz = jedno prywatne zaproszenie wygenerowane przez kupującego
--   • token to losowy sekret w linku (kupujący przekazuje go sam)
--   • druga osoba akceptuje i PODAJE SWÓJ e-mail — dopiero wtedy
--     tworzymy harmonogram partner_mailings
-- ------------------------------------------------------------
create table if not exists public.share_invites (
  id               bigint generated always as identity primary key,
  token            text not null unique,
  inviter_email    text not null,
  invited_email    text,                       -- ustawiany przy akceptacji
  status           text not null default 'pending'
                     check (status in ('pending', 'accepted', 'revoked')),
  accepted_at      timestamptz,
  created_at       timestamptz not null default now()
);

create index if not exists share_invites_inviter_idx on public.share_invites (inviter_email);
create index if not exists share_invites_token_idx   on public.share_invites (token);

-- ------------------------------------------------------------
-- partner_mailings: wymagane pola dla wymogów prawnych / UX
--   • max raz dziennie  -> next_send_at (już jest, pilnuje cron)
--   • stop kolejnych    -> unsubscribe_token w każdej wiadomości
-- ------------------------------------------------------------
alter table public.partner_mailings
  add column if not exists unsubscribe_token text;
alter table public.partner_mailings
  add column if not exists invite_id bigint;
alter table public.partner_mailings
  add column if not exists stopped_reason text;

create index if not exists partner_mailings_unsub_idx
  on public.partner_mailings (unsubscribe_token);

-- ------------------------------------------------------------
-- RLS: wszystko przez service role (API routes). Anon brak dostępu.
-- ------------------------------------------------------------
alter table public.share_invites enable row level security;
-- (brak polityk = anon/authenticated nic nie mogą; service role omija RLS)

-- ============================================================
--  KONIEC
-- ============================================================
