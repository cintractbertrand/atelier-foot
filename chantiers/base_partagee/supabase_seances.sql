-- Atelier Foot : séances partagées du club (à lancer APRÈS supabase.sql et supabase_verrou.sql,
-- dans Supabase > SQL Editor > Run). Même code club que pour les fiches.
create table if not exists public.seances (
  id          text primary key,
  data        jsonb not null,            -- { nom, exercices:[{id,duree,variante}] }
  auteur      text,
  date_seance date,
  maj         timestamptz not null default now(),
  retiree     boolean not null default false
);
alter table public.seances enable row level security;
revoke all on public.seances from anon, authenticated;

create or replace function public.publier_seance(code text, sid text, seance jsonb, auteur text default '', datej date default null)
returns text language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.code_ok(code) then raise exception 'code club incorrect'; end if;
  if coalesce(sid, '') = '' or length(seance::text) > 100000 then raise exception 'séance invalide'; end if;
  insert into public.seances (id, data, auteur, date_seance, maj, retiree)
  values (sid, seance, left(coalesce(auteur, ''), 40), datej, now(), false)
  on conflict (id) do update set data = excluded.data, auteur = excluded.auteur, date_seance = excluded.date_seance, maj = now(), retiree = false;
  return sid;
end $$;

create or replace function public.retirer_seance(code text, sid text)
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.code_ok(code) then raise exception 'code club incorrect'; end if;
  update public.seances set retiree = true, maj = now() where id = sid;
end $$;

create or replace function public.lire_seances(code text)
returns jsonb language plpgsql stable security definer set search_path = public, extensions as $$
begin
  if not public.code_ok(code) then raise exception 'code club incorrect'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('id', id, 'data', data, 'auteur', auteur, 'date_seance', date_seance, 'maj', maj)
                   order by date_seance desc nulls last) from public.seances where not retiree), '[]'::jsonb);
end $$;

revoke all on function public.publier_seance(text, text, jsonb, text, date) from public;
revoke all on function public.retirer_seance(text, text) from public;
revoke all on function public.lire_seances(text) from public;
grant execute on function public.publier_seance(text, text, jsonb, text, date) to anon, authenticated;
grant execute on function public.retirer_seance(text, text) to anon, authenticated;
grant execute on function public.lire_seances(text) to anon, authenticated;
