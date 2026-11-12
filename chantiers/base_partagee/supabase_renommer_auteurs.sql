-- Renomme les auteurs : « coach bc » -> « bc », « Nico » -> « Nicolas Rouseau ».
-- À coller une fois dans Supabase > SQL Editor > Run. Aucune fiche n'est supprimée.
do $$
declare t text;
begin
  foreach t in array array['fiches','seances','brouillons','saison_periodes'] loop
    if to_regclass('public.'||t) is null then continue; end if;
    execute format($q$update public.%I set auteur='bc' where lower(trim(auteur)) in ('coach bc','bc')$q$, t);
    execute format($q$update public.%I set auteur='Nicolas Rouseau' where lower(trim(auteur))='nico' or lower(trim(auteur)) like 'nicolas rou%%'$q$, t);
    execute format($q$update public.%I set data=jsonb_set(data,'{auteur}','"bc"') where lower(trim(data->>'auteur')) in ('coach bc','bc')$q$, t);
    execute format($q$update public.%I set data=jsonb_set(data,'{auteur}','"Nicolas Rouseau"') where lower(trim(data->>'auteur'))='nico' or lower(trim(data->>'auteur')) like 'nicolas rou%%'$q$, t);
  end loop;
end $$;
