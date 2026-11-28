-- ============================================================
--  TREŚCI STRONY (edytowalne z panelu /admin -> "Treści strony")
--  Wklej w: Supabase -> SQL Editor -> New query -> Run
--  Skrypt idempotentny. Wartości domyślne są w kodzie (fallback),
--  więc tabela może startować pusta.
-- ============================================================

create table if not exists public.site_content (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

-- RLS: dostęp wyłącznie przez service role (API /api/admin/content).
-- Anon/authenticated nie mają dostępu.
alter table public.site_content enable row level security;

-- (opcjonalnie) trigger aktualizujący updated_at przy UPDATE
create or replace function public.set_site_content_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_site_content_updated on public.site_content;
create trigger trg_site_content_updated
  before update on public.site_content
  for each row execute function public.set_site_content_updated_at();

-- ============================================================
--  WERSJONOWANIE TREŚCI
--  Każdy zapis tworzy snapshot; można przywrócić dowolną wersję.
-- ============================================================
create table if not exists public.site_content_versions (
  id          bigserial primary key,
  snapshot    jsonb not null,            -- pełny stan treści w tej wersji
  saved_by    text,                      -- opcjonalnie: kto zapisał
  label       text,                      -- opcjonalnie: krótki opis
  created_at  timestamptz not null default now()
);

-- Opis zmian: co konkretnie zmieniło się w tej wersji
alter table public.site_content_versions
  add column if not exists changes jsonb not null default '{}'::jsonb;
alter table public.site_content_versions
  add column if not exists changed_count int not null default 0;

create index if not exists idx_site_content_versions_created
  on public.site_content_versions (created_at desc);

-- RLS: dostęp wyłącznie przez service role (API admina)
alter table public.site_content_versions enable row level security;

-- ============================================================
--  KUPONY RABATOWE (edytowalne z panelu /admin -> "Kupony")
-- ============================================================
create table if not exists public.coupons (
  code        text primary key,                    -- kod (wielkie litery)
  percent     int  not null default 0,             -- rabat 0-100 (%)
  active      boolean not null default true,       -- czy kupon działa
  max_uses    int,                                 -- limit użyć (null = bez limitu)
  uses        int  not null default 0,             -- ile razy użyty
  expires_at  timestamptz,                         -- ważność (null = bezterminowo)
  note        text,                                -- opis w panelu
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint coupons_percent_range check (percent between 0 and 100)
);

create index if not exists idx_coupons_active on public.coupons (active);

-- RLS: dostęp wyłącznie przez service role (API admina)
alter table public.coupons enable row level security;

-- ============================================================
--  KONIEC
-- ============================================================

