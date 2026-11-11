# Génère seed_fiches.sql (NON publié sur GitHub, voir .gitignore) avec toutes les fiches de exercices/.
# Usage : python chantiers/base_partagee/generer_seed.py   puis coller seed_fiches.sql dans Supabase > SQL Editor.
import json,glob,os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))
out=['-- Fiches de départ (généré). Relançable : met à jour les fiches existantes.']
for f in sorted(glob.glob('exercices/*/*.json')):
    d=json.load(open(f,encoding='utf-8'));a=(d.get('auteur') or 'ESGA').replace("'","''")
    assert '$fiche$' not in json.dumps(d)
    out.append("insert into public.fiches (id,data,auteur) values ('%s',$fiche$%s$fiche$::jsonb,'%s') on conflict (id) do update set data=excluded.data,auteur=excluded.auteur,maj=now();"%(d['id'],json.dumps(d,ensure_ascii=False),a))
open('chantiers/base_partagee/seed_fiches.sql','w',encoding='utf-8').write('\n'.join(out)+'\n')
print(len(out)-1,'fiches')
