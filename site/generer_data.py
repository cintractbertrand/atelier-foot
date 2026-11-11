import json,glob,os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..'))
L=[json.load(open(f,encoding='utf-8')) for f in sorted(glob.glob('exercices/*/*.json'))]
open('site/data.js','w',encoding='utf-8').write('window.EXERCICES='+json.dumps(L,ensure_ascii=False,indent=1)+';\n')
print(len(L),'fiches')
