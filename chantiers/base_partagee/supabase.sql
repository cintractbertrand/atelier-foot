-- Atelier Foot : base partagée des fiches du club (Supabase)
-- À coller dans Supabase > SQL Editor, puis « Run ».
-- AVANT de lancer : remplace CODE_CLUB_ICI (ligne plus bas) par le code que tu donneras aux éducateurs.
-- Le code est stocké chiffré : il n'apparaît nulle part en clair, ni dans le site ni sur GitHub.

create extension if not exists pgcrypto with schema extensions;

-- Fiches partagées (lecture libre, écriture seulement par les fonctions ci-dessous)
create table if not exists public.fiches (
  id      text primary key,
  data    jsonb not null,
  auteur  text,
  maj     timestamptz not null default now(),
  retiree boolean not null default false   -- « Retirer » masque la fiche sans l'effacer
);
alter table public.fiches enable row level security;
drop policy if exists lecture on public.fiches;
create policy lecture on public.fiches for select to anon, authenticated using (true);
revoke insert, update, delete on public.fiches from anon, authenticated;

-- Code club (chiffré), illisible depuis le site
create table if not exists public.reglage (cle text primary key, valeur text not null);
alter table public.reglage enable row level security;
revoke all on public.reglage from anon, authenticated;
insert into public.reglage (cle, valeur)
values ('code', extensions.crypt('CODE_CLUB_ICI', extensions.gen_salt('bf')))
on conflict (cle) do update set valeur = excluded.valeur;

create or replace function public.code_ok(code text) returns boolean
language sql stable security definer set search_path = public, extensions as $$
  select exists (select 1 from public.reglage where cle = 'code' and valeur = extensions.crypt(code, valeur));
$$;

-- Publier ou mettre à jour une fiche
create or replace function public.publier_fiche(code text, fiche jsonb, auteur text default '')
returns text language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.code_ok(code) then raise exception 'code club incorrect'; end if;
  if coalesce(fiche->>'id', '') = '' or length(fiche::text) > 200000 then raise exception 'fiche invalide'; end if;
  insert into public.fiches (id, data, auteur, maj, retiree)
  values (fiche->>'id', fiche, left(coalesce(auteur, ''), 40), now(), false)
  on conflict (id) do update set data = excluded.data, auteur = excluded.auteur, maj = now(), retiree = false;
  return fiche->>'id';
end $$;

-- Retirer une fiche (masquée, récupérable dans Table Editor en remettant retiree à false)
create or replace function public.retirer_fiche(code text, fid text)
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.code_ok(code) then raise exception 'code club incorrect'; end if;
  update public.fiches set retiree = true, maj = now() where id = fid;
end $$;

revoke all on function public.code_ok(text) from public, anon, authenticated;
revoke all on function public.publier_fiche(text, jsonb, text) from public;
revoke all on function public.retirer_fiche(text, text) from public;
grant execute on function public.publier_fiche(text, jsonb, text) to anon, authenticated;
grant execute on function public.retirer_fiche(text, text) to anon, authenticated;

-- Pour changer de code plus tard : relance seulement le bloc « insert into public.reglage … » avec le nouveau code.
