# Conversion des fiches au format v3 de l'éditeur (départ + temps).
# Chaque animation suit l'organisation, le déroulement et les consignes de la fiche.
import json,glob,os,math
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..')
os.chdir(ROOT)
OFF=(9,6)
def build(w,h,fn):
    s=min(260/w,156/h);fw,fh=w*s,h*s;fx=20+(260-fw)/2;fy=22+(156-fh)/2
    P=lambda u,v:[round(fx+u*fw),round(fy+v*fh)]
    I=[];TT=[];pos={};cur={'T':None}
    def add(d):I.append(d);return len(I)-1
    def pl(u,v,c,l):i=add({'t':'p','c':c,'l':l,'x':P(u,v)[0],'y':P(u,v)[1]});pos[i]=P(u,v);return i
    def plot(u,v):add({'t':'plot','x':P(u,v)[0],'y':P(u,v)[1]})
    def but(u,v,rot=0):
        d={'t':'but','x':P(u,v)[0],'y':P(u,v)[1]}
        if rot:d['rot']=rot
        add(d)
    def zone(u,v,ww,hh):x,y=P(u,v);add({'t':'zone','x':x,'y':y,'w':round(ww*fw),'h':round(hh*fh)})
    def ball(own):b=add({'t':'ball','x':pos[own][0]+OFF[0],'y':pos[own][1]+OFF[1],'o':own});return b
    def T():
        if cur['T'] is not None:
            for i,q in cur['T'].items():
                if I[i]['t']=='p':pos[i]=[q['x'],q['y']]
        cur['T']={};TT.append({'moves':cur['T']})
    def where(i):q=cur['T'].get(i);return [q['x'],q['y']] if q and I[i]['t']=='p' else pos[i]
    def mv(i,u,v):x,y=P(u,v);cur['T'][i]={'x':x,'y':y}
    def mvp(i,xy):cur['T'][i]={'x':round(xy[0]),'y':round(xy[1])}
    def ps(b,to=None,u=None,v=None):
        if to is not None:p=where(to);cur['T'][b]={'x':p[0]+OFF[0],'y':p[1]+OFF[1],'o':to}
        else:x,y=P(u,v);cur['T'][b]={'x':x,'y':y,'o':None}
    def press(defs,target,n=2,f=.35):
        t=where(target);ds=sorted(defs,key=lambda d:math.dist(where(d),t))[:n]
        for d in ds:p=where(d);mvp(d,(p[0]+(t[0]-p[0])*f,p[1]+(t[1]-p[1])*f))
    def appel(j,defs,a=.07):
        p=where(j);d=min(defs,key=lambda d:math.dist(where(d),p));q=where(d);L=math.dist(p,q) or 1
        nx=min(max(p[0]+(p[0]-q[0])/L*a*fw,fx),fx+fw);ny=min(max(p[1]+(p[1]-q[1])/L*a*fh,fy),fy+fh);mvp(j,(nx,ny))
    fn(locals())
    if cur['T'] is not None:pass
    return {'v':3,'w':w,'h':h,'items':I,'temps':TT}
M={}
def ech001(e):
    for u,v in [(0,0),(1,0),(0,1),(1,1)]:e['plot'](u,v)
    A=e['pl'](.5,0,'b','A');B=e['pl'](1,.5,'b','B');C=e['pl'](.5,1,'b','C');D=e['pl'](0,.5,'b','D')
    r1=e['pl'](.4,.4,'r','1');r2=e['pl'](.6,.6,'r','2');bl=e['ball'](A);R=[r1,r2]
    # passes autour du carré ; le receveur suivant se décale pour offrir un angle, les défenseurs coulissent vers le ballon
    for rec,nxt,(u,v) in [(B,C,(.62,1)),(C,D,(0,.62)),(D,A,(.38,0)),(A,B,(1,.4))]:
        e['T']();e['ps'](bl,to=rec);e['mv'](nxt,u,v);e['press'](R,rec,2,.3)
M['ech-001']=build(12,12,ech001)
def ech002(e):
    for u,v in [(0,0),(1,0),(0,1),(1,1)]:e['plot'](u,v)
    prs=[]
    for a,b,c,d in [(.15,.25,.5,.15),(.85,.35,.8,.75),(.2,.8,.5,.6)]:
        A=e['pl'](a,b,'b','A');B=e['pl'](c,d,'b','B');prs.append((A,B,e['ball'](A),a,b,c,d))
    e['T']()  # le porteur conduit, le joueur sans ballon trottine pour se rendre disponible
    for A,B,bl,a,b,c,d in prs:e['mv'](A,a+(c-a)*.35,b+(d-b)*.35);e['mv'](B,c+.04,d+.05)
    e['T']()  # passe au joueur sans ballon
    for A,B,bl,*_ in prs:e['ps'](bl,to=B)
    e['T']()  # remise en une touche
    for A,B,bl,*_ in prs:e['ps'](bl,to=A)
M['ech-002']=build(20,20,ech002)
def ech003(e):
    for u,v in [(0,0),(1,0),(0,1),(1,1)]:e['plot'](u,v)
    duos=[]
    for a,b,c,d,ru,rv in [(.12,.85,.38,.85,.32,.4),(.6,.85,.86,.85,.78,.4)]:
        A=e['pl'](a,b,'b','A');B=e['pl'](c,d,'b','B');duos.append((A,B,e['ball'](A),ru,rv))
    e['T']()  # A passe à B
    for A,B,bl,ru,rv in duos:e['ps'](bl,to=A if False else B)
    e['T']()  # A fait un appel en sprintant, B remet en une touche dans la course
    for A,B,bl,ru,rv in duos:e['mv'](A,ru,rv);e['ps'](bl,to=A)
    e['T']()  # A enchaîne en conduite
    for A,B,bl,ru,rv in duos:e['mv'](A,ru+.08,rv-.25)
M['ech-003']=build(30,20,ech003)
def ech004(e):
    for (u,v) in [(.15,.25),(.5,.15),(.85,.3),(.2,.85),(.55,.8),(.85,.85)]:e['plot'](u-.04,v);e['plot'](u+.04,v)
    A=e['pl'](.42,.5,'b','A');B=e['pl'](.7,.55,'b','B');C=e['pl'](.25,.6,'b','C')
    r1=e['pl'](.55,.4,'r','1');r2=e['pl'](.75,.7,'r','2');r3=e['pl'](.3,.35,'r','3');bl=e['ball'](A)
    e['T']()  # A conduit et traverse une porte ; B vient aider le porteur ; les défenseurs suivent
    e['mv'](A,.5,.07);e['mv'](B,.66,.2);e['mv'](r1,.53,.22);e['mv'](r3,.4,.2)
    e['T']()  # même porte interdite : A passe à B
    e['ps'](bl,to=B);e['mv'](r1,.6,.18)
    e['T']()  # B conduit à travers une autre porte
    e['mv'](B,.86,.4);e['mv'](r2,.82,.5);e['mv'](C,.5,.4)
M['ech-004']=build(40,30,ech004)
def ech005(e):
    for u,v in [(0,0),(1,0),(0,1),(1,1)]:e['plot'](u,v)
    ring=[e['pl'](u,v,'b',l) for (u,v),l in zip([(.5,.06),(.9,.12),(.94,.55),(.85,.92),(.5,.94),(.12,.88),(.06,.5),(.15,.12)],'ABCDEFGH')]
    R=[e['pl'](u,v,'r',str(k+1)) for k,(u,v) in enumerate([(.4,.35),(.62,.38),(.38,.62),(.6,.65)])]
    bl=e['ball'](ring[0])
    for k in range(1,9):  # 2 touches : passes rapides, les 2 défenseurs les plus proches pressent le receveur
        rec=ring[k%8];e['T']();e['ps'](bl,to=rec);e['press'](R,rec,2,.3)
M['ech-005']=build(25,25,ech005)
def ech006(e):
    for u,v in [(0,0),(1,0),(0,1),(1,1)]:e['plot'](u,v)
    Bl=[e['pl'](u,v,'b',l) for (u,v),l in zip([(.25,.3),(.5,.6),(.78,.25),(.4,.85),(.6,.12)],'ABCDE')]
    R=[e['pl'](u,v,'r',str(k+1)) for k,(u,v) in enumerate([(.2,.6),(.45,.3),(.8,.6),(.3,.12),(.7,.88)])]
    J1=e['pl'](0,.5,'j','J');J2=e['pl'](1,.5,'j','J');bl=e['ball'](Bl[0])
    for rec in [Bl[1],J1,Bl[3],J2,Bl[2],Bl[4],Bl[0]]:  # 7 passes ; le receveur se démarque, les rouges pressent
        e['T']()
        if rec not in (J1,J2):e['appel'](rec,R)
        e['ps'](bl,to=rec);e['press'](R,rec,2,.3)
M['ech-006']=build(40,35,ech006)
def ech007(e):
    e['zone'](0,0,1,.18);e['zone'](0,.82,1,.18)
    b1=e['pl'](.3,.6,'b','A');b2=e['pl'](.55,.5,'b','B');b3=e['pl'](.75,.62,'b','C')
    R=[e['pl'](u,v,'r',str(k+1)) for k,(u,v) in enumerate([(.3,.4),(.55,.32),(.75,.42)])]
    G=e['pl'](.5,.08,'j','G');G2=e['pl'](.5,.92,'j','G');bl=e['ball'](b1)
    e['T']()  # jeu vers l'avant : A passe à B qui décroche
    e['mv'](b2,.5,.55);e['ps'](bl,to=b2);e['press'](R,b2,1,.3);e['mv'](b3,.8,.35)
    e['T']()  # B joue C qui part dans la profondeur
    e['ps'](bl,to=b3);e['press'](R,b3,2,.3)
    e['T']()  # passe aérienne au gardien dans la zone adverse
    e['ps'](bl,to=G)
M['ech-007']=build(60,40,ech007)
def ech008(e):
    e['zone'](0,0,1,.15);e['zone'](0,.85,1,.15)
    b1=e['pl'](.2,.7,'b','A');b2=e['pl'](.5,.55,'b','B');b3=e['pl'](.8,.6,'b','C')
    R=[e['pl'](u,v,'r',str(k+1)) for k,(u,v) in enumerate([(.3,.45),(.55,.35),(.78,.4)])]
    bl=e['ball'](b1)
    e['T']();e['ps'](bl,to=b2);e['mv'](b3,.82,.35);e['press'](R,b2,1,.3)  # C prend l'information et se démarque
    e['T']();e['ps'](bl,to=b3);e['press'](R,b3,2,.3)
    e['T']();e['mv'](b3,.85,.08);e['press'](R,b3,1,.4)  # C conduit et arrête le ballon dans la zone
M['ech-008']=build(50,30,ech008)
def tac001(e):
    e['but'](.5,.03);e['zone'](.05,.15,.9,.2)
    L=[]
    for x in (.2,.5,.8):
        e['plot'](x-.1,.97);D=e['pl'](x,.6,'r','D');A=e['pl'](x,.9,'b','A');L.append((x,A,D,e['ball'](A)))
    e['T']()  # feinte : l'attaquant part d'un côté, le défenseur suit
    for x,A,D,bl in L:e['mv'](A,x-.07,.68);e['mv'](D,x-.05,.56)
    e['T']()  # changement de direction et de rythme, entrée dans la zone de tir ; le défenseur reste dehors
    for x,A,D,bl in L:e['mv'](A,x+.05,.3);e['mv'](D,x,.42)
    e['T']()  # tir dans la zone
    for x,A,D,bl in L:e['ps'](bl,u=.5+(x-.5)*.1,v=.05)
M['tac-001']=build(15,12,tac001)
def tac002(e):
    L=[]
    for i in range(4):
        v=.125+.25*i;e['zone'](0,v-.125,1,.25);e['zone'](0,v-.125,.17,.25);e['zone'](.83,v-.125,.17,.25)
        A=e['pl'](.25,v,'b','A');D=e['pl'](.65,v,'r','D');L.append((v,A,D,e['ball'](A)))
    e['T']()  # l'attaquant conduit et feinte d'un côté
    for v,A,D,bl in L:e['mv'](A,.48,v-.06);e['mv'](D,.6,v-.05)
    e['T']()  # débordement de l'autre côté, arrêt du ballon dans l'en-but
    for v,A,D,bl in L:e['mv'](A,.9,v+.07);e['mv'](D,.72,v+.02)
M['tac-002']=build(12,24,tac002)
def tec001(e):
    for u,v in [(0,0),(1,0),(1,1),(0,1)]:e['plot'](u,v)
    A=e['pl'](0,0,'b','A');B=e['pl'](1,0,'b','B');C=e['pl'](1,1,'b','C');D=e['pl'](0,1,'b','D')
    b1=e['ball'](A);b2=e['ball'](C)  # 2 ballons dans le groupe, chacun reste sur son plot
    for (x,y),(z,t) in [((b1,B),(b2,D)),((b1,C),(b2,A)),((b1,D),(b2,B)),((b1,A),(b2,C))]:
        e['T']();e['ps'](x,to=y);e['ps'](z,to=t)
M['tec-001']=build(15,15,tec001)
def tec002(e):
    A=e['pl'](.1,.2,'b','A');B=e['pl'](.4,.45,'b','B');C=e['pl'](.75,.75,'b','C');D=e['pl'](.35,.85,'b','D');E=e['pl'](.08,.6,'b','E')
    for u,v in [(.1,.2),(.4,.45),(.75,.75),(.35,.85),(.08,.6)]:e['plot'](u-.04,v+.06)
    e['but'](.95,.45,90);bl=e['ball'](A)
    seq=[(A,B),(B,C),(C,D),(D,E)]
    P0={A:(.1,.2),B:(.4,.45),C:(.75,.75),D:(.35,.85),E:(.08,.6)}
    prev=None
    for k,(x,y) in enumerate(seq):  # passe puis le passeur va au poste suivant
        e['T']();e['ps'](bl,to=y)
        if prev:e['mv'](prev[0],*P0[prev[1]])
        prev=(x,y)
    e['T']();e['ps'](bl,u=.95,v=.45);e['mv'](prev[0],*P0[prev[1]])  # E contrôle et tire
    e['T']();e['mv'](E,*P0[A])
M['tec-002']=build(25,20,tec002)
def tec003(e):
    pts=[(.1,.85,'j','A'),(.37,.15,'r','D'),(.63,.85,'j','E'),(.9,.15,'r','F')]
    ids=[]
    for u,v,c,l in pts:e['plot'](u-.06,v);ids.append(e['pl'](u,v,c,l))
    bl=e['ball'](ids[0])
    for k in [1,2,3,2,1,0]:e['T']();e['ps'](bl,to=ids[k])  # zigzag aller puis retour ; chacun reste sur place
M['tec-003']=build(20,10,tec003)
n=0
for f in glob.glob('exercices/*/*.json'):
    d=json.load(open(f,encoding='utf-8'))
    if d['id'] in M:
        d['schema_modele']=M[d['id']];d.pop('schema_svg',None)
        json.dump(d,open(f,'w',encoding='utf-8'),ensure_ascii=False,indent=2);n+=1
print(n,'fiches converties')
