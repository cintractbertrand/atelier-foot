-- Atelier Foot : planificateur de saison (thèmes par période). À lancer APRÈS supabase.sql et supabase_verrou.sql,
-- dans Supabase > SQL Editor > Run. Même code club que pour les fiches et les séances.
create table if not exists public.saison_periodes (
  id      text primary key,
  data    jsonb not null,            -- { theme, cat, debut, fin, note }
  auteur  text,
  maj     timestamptz not null default now(),
  retiree boolean not null default false
);
alter table public.saison_periodes enable row level security;
revoke all on public.saison_periodes from anon, authenticated;

create or replace function public.publier_periode(code text, pid text, periode jsonb, auteur text default '')
returns text language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.code_ok(code) then raise exception 'code club incorrect'; end if;
  if coalesce(pid, '') = '' or length(periode::text) > 5000 then raise exception 'période invalide'; end if;
  insert into public.saison_periodes (id, data, auteur, maj, retiree)
  values (pid, periode, left(coalesce(auteur, ''), 40), now(), false)
  on conflict (id) do update set data = excluded.data, auteur = excluded.auteur, maj = now(), retiree = false;
  return pid;
end $$;

create or replace function public.retirer_periode(code text, pid text)
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.code_ok(code) then raise exception 'code club incorrect'; end if;
  update public.saison_periodes set retiree = true, maj = now() where id = pid;
end $$;

create or replace function public.lire_periodes(code text)
returns jsonb language plpgsql stable security definer set search_path = public, extensions as $$
begin
  if not public.code_ok(code) then raise exception 'code club incorrect'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('id', id, 'data', data, 'auteur', auteur, 'maj', maj)
                   order by data->>'debut') from public.saison_periodes where not retiree), '[]'::jsonb);
end $$;

revoke all on function public.publier_periode(text, text, jsonb, text) from public;
revoke all on function public.retirer_periode(text, text) from public;
revoke all on function public.lire_periodes(text) from public;
grant execute on function public.publier_periode(text, text, jsonb, text) to anon, authenticated;
grant execute on function public.retirer_periode(text, text) to anon, authenticated;
grant execute on function public.lire_periodes(text) to anon, authenticated;
