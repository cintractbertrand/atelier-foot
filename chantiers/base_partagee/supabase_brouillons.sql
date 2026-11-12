-- Atelier Foot : brouillons de fiches partagés (à lancer APRÈS supabase.sql et supabase_verrou.sql,
-- dans Supabase > SQL Editor > Run). Même code club que pour les fiches.
-- Un brouillon n'est jamais dans la table `fiches` : il n'apparaît pas dans la base d'exercices.
create table if not exists public.brouillons (
  id      text primary key,
  data    jsonb not null,            -- { titre, M, champs, editingId, varEdit }
  auteur  text,
  maj     timestamptz not null default now(),
  retiree boolean not null default false
);
alter table public.brouillons enable row level security;
revoke all on public.brouillons from anon, authenticated;

create or replace function public.publier_brouillon(code text, bid text, brouillon jsonb, auteur text default '')
returns text language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.code_ok(code) then raise exception 'code club incorrect'; end if;
  if coalesce(bid, '') = '' or length(brouillon::text) > 300000 then raise exception 'brouillon invalide'; end if;
  insert into public.brouillons (id, data, auteur, maj, retiree)
  values (bid, brouillon, left(coalesce(auteur, ''), 40), now(), false)
  on conflict (id) do update set data = excluded.data, auteur = excluded.auteur, maj = now(), retiree = false;
  return bid;
end $$;

create or replace function public.retirer_brouillon(code text, bid text)
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.code_ok(code) then raise exception 'code club incorrect'; end if;
  update public.brouillons set retiree = true, maj = now() where id = bid;
end $$;

create or replace function public.lire_brouillons(code text)
returns jsonb language plpgsql stable security definer set search_path = public, extensions as $$
begin
  if not public.code_ok(code) then raise exception 'code club incorrect'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('id', id, 'data', data, 'auteur', auteur, 'maj', maj) order by maj desc)
                   from public.brouillons where not retiree), '[]'::jsonb);
end $$;

revoke all on function public.publier_brouillon(text, text, jsonb, text) from public;
revoke all on function public.retirer_brouillon(text, text) from public;
revoke all on function public.lire_brouillons(text) from public;
grant execute on function public.publier_brouillon(text, text, jsonb, text) to anon, authenticated;
grant execute on function public.retirer_brouillon(text, text) to anon, authenticated;
grant execute on function public.lire_brouillons(text) to anon, authenticated;
