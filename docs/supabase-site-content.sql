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
--  KONIEC
-- ============================================================
