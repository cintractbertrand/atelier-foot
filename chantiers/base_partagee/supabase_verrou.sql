-- Atelier Foot : verrou de lecture (à lancer APRÈS supabase.sql, dans Supabase > SQL Editor > Run).
-- Après ce script, la table des fiches n'est plus lisible librement : il faut le code club.

drop policy if exists lecture on public.fiches;
revoke select on public.fiches from anon, authenticated;

create or replace function public.lire_fiches(code text)
returns jsonb language plpgsql stable security definer set search_path = public, extensions as $$
begin
  if not public.code_ok(code) then raise exception 'code club incorrect'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('data', data, 'auteur', auteur, 'maj', maj) order by maj desc)
                   from public.fiches where not retiree), '[]'::jsonb);
end $$;

revoke all on function public.lire_fiches(text) from public;
grant execute on function public.lire_fiches(text) to anon, authenticated;
