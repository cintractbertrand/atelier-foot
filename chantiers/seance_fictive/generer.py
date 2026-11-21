#!/usr/bin/env python3
"""Séance fictive de démonstration (3 fiches avec schéma animé sur grand terrain).
Usage : python chantiers/seance_fictive/generer.py [dossier_de_sortie]
Les positions sont écrites en mètres (x = largeur, y = profondeur, 0 = ligne de but en haut)
puis converties dans le repère du site (même calcul que field() dans site/editeur.js)."""
import json, os, sys

SRC = "Fiche fictive de démonstration"


def champ(w, h):
    r = min(2.2, max(.8, w / h))
    if r > 260 / 156:
        fw, fh = 260, 260 / r
    else:
        fh, fw = 156, 156 * r
    q = lambda v: round(v * 10) / 10
    return q(20 + (260 - fw) / 2), q(22 + (156 - fh) / 2), q(fw), q(fh)


class Schema:
    def __init__(self, w, h, demi=False):
        self.w, self.h, self.demi = w, h, demi
        self.fx, self.fy, self.fw, self.fh = champ(w, h)
        self.items, self.n, self.temps = [], {}, []

    def u(self, x, y):
        return round(self.fx + x * self.fw / self.w, 1), round(self.fy + y * self.fh / self.h, 1)

    def add(self, nom, t, x, y, **kw):
        ux, uy = self.u(x, y)
        it = {"t": t, **kw, "x": ux, "y": uy}
        self.n[nom] = len(self.items)
        self.items.append(it)

    def joueur(self, nom, c, lab, x, y):
        self.add(nom, "p", x, y, c=c, l=lab)

    def balle(self, nom, proprio):
        self.items.append({"t": "ball", "x": 0, "y": 0, "o": self.n[proprio]})
        self.n[nom] = len(self.items) - 1

    def temps_(self, **mv):
        """mv : nom=(x, y) pour un joueur ; ballon=('passe', receveur) ou ('tir', x, y)."""
        moves = {}
        for nom, v in mv.items():
            i = self.n[nom]
            if self.items[i]["t"] == "ball":
                if v[0] == "passe":
                    ux, uy = self.u(0, 0)
                    moves[str(i)] = {"x": ux, "y": uy, "o": self.n[v[1]]}
                else:
                    ux, uy = self.u(v[1], v[2])
                    moves[str(i)] = {"x": ux, "y": uy, "o": None}
            else:
                ux, uy = self.u(v[0], v[1])
                m = {"x": ux, "y": uy}
                if len(v) > 2:
                    cx, cy = self.u(v[2], v[3])
                    m["c"] = [cx, cy]
                moves[str(i)] = m
        self.temps.append({"moves": moves})

    def json(self):
        m = {"v": 3, "w": self.w, "h": self.h, "items": self.items, "temps": self.temps}
        if self.demi:
            m["fond"] = "demi"
        return m


def fiche(**kw):
    base = {"public": ["filles", "garçons"], "auteur": "Démo", "source": SRC, "fictive": True}
    base.update(kw)
    return base


# ------------------------------------------------------------------ 1. Sortie de balle
def sortie():
    s = Schema(55, 40)
    s.add("but", "but", 27.5, 39.2)
    s.add("zone", "zone", 0, 0)
    z = s.items[-1]; z["x"], z["y"] = s.u(0, 0); z["w"] = round(s.fw, 1); z["h"] = round(12 * s.fh / s.h, 1)
    for x in (0, 55):
        s.add("pl%d" % x, "plot", x, 12)
    s.joueur("GB", "j", "G", 27.5, 37)
    s.joueur("A", "b", "A", 13, 32); s.joueur("B", "b", "B", 42, 32)
    s.joueur("C", "b", "C", 27.5, 24)
    s.joueur("D", "b", "D", 51, 23); s.joueur("E", "b", "E", 4, 23)
    s.joueur("I", "b", "I", 27.5, 15)
    s.joueur("r1", "r", "1", 21, 24); s.joueur("r2", "r", "2", 34, 24); s.joueur("r3", "r", "3", 27.5, 17)
    s.balle("bal", "GB")
    s.temps_(bal=("passe", "A"), A=(14, 32), r1=(17, 28), r2=(30, 26), r3=(37, 22))
    s.temps_(bal=("passe", "C"), C=(26, 28), E=(5, 20), r1=(20, 29), r2=(31, 31), r3=(40, 24), I=(24, 16))
    s.temps_(bal=("passe", "B"), B=(42, 31), D=(52, 21), r2=(33, 29), r1=(28, 28), r3=(44, 24))
    s.temps_(bal=("passe", "D"), D=(52, 20), I=(33, 14), r3=(48, 21), r2=(40, 24), r1=(36, 22), E=(7, 14))
    s.temps_(bal=("passe", "I"), I=(34, 9), D=(50, 14), r2=(36, 14), r3=(47, 17), C=(30, 21))
    s.temps_(bal=("passe", "E"), E=(11, 7), I=(30, 8), r1=(30, 12))
    return fiche(
        id="fic-001", titre="Sortie de balle 5+GB contre 3",
        theme="tactique", categories=["U15", "U18", "Seniors"], niveau="confirmé", duree_min=15,
        joueurs={"min": 10, "max": 12}, surface="55 x 40 m, zone d'arrivée de 12 m",
        materiel=[{"nom": "ballons", "quantite": 4}, {"nom": "plots", "quantite": 8}, {"nom": "chasubles", "quantite": 3},
                  {"nom": "buts", "quantite": 1}],
        objectif="Sortir proprement de sa zone malgré un pressing à trois et atteindre l'attaquant dans la zone d'arrivée.",
        organisation="Le gardien et 5 joueurs (2 défenseurs, 2 latéraux, 1 milieu) contre 3 presseurs. Un attaquant évolue devant, dans la zone d'arrivée de 12 m. Le gardien démarre l'action à la main ou au pied.",
        deroulement="Les presseurs ne peuvent pas rentrer dans les 5 m du gardien. Point quand le ballon arrive à l'attaquant dans la zone d'arrivée, un autre point si le dernier relayeur est un latéral. Si les presseurs récupèrent, ils marquent en conduisant dans la zone. 5 passages puis rotation des rôles.",
        consignes=["Attirer le pressing d'un côté, ressortir de l'autre.", "Un contact pour jouer, deux pour attirer.", "L'éducateur regarde : orientation du corps avant la réception."],
        variantes=[{"nom": "Deux touches max", "change": "Chaque joueur de sortie touche deux fois maximum.", "difficulte": "plus difficile"},
                   {"nom": "4 presseurs", "change": "Un quatrième presseur entre après la deuxième passe.", "difficulte": "plus difficile"},
                   {"nom": "Gardien libre", "change": "Les presseurs n'ont plus d'interdiction autour du gardien.", "difficulte": "plus difficile"}],
        mots_cles=["sortie de balle", "pressing", "gardien", "passage de ligne", "5 contre 3"],
        schema_modele=s.json())


# ------------------------------------------------------------------ 2. Attaque placée (fiche phare)
def attaque():
    s = Schema(68, 52, demi=True)
    s.add("but", "but", 34, 0)
    # zones de finition
    s.add("zone", "zone", 0, 0)
    z = s.items[-1]; z["x"], z["y"] = s.u(22, 0); z["w"] = round(24 * s.fw / s.w, 1); z["h"] = round(16 * s.fh / s.h, 1)
    # défense rouge (4-2-1) + gardien
    s.joueur("GR", "j", "G", 34, 3.4)
    for k, (x, y) in enumerate([(14, 15), (27, 13), (41, 13), (54, 15)], 1):
        s.joueur("r%d" % k, "r", str(k), x, y)
    s.joueur("r5", "r", "5", 26, 25); s.joueur("r6", "r", "6", 42, 25); s.joueur("r7", "r", "7", 34, 34)
    # attaque bleue 9
    s.joueur("A", "b", "A", 23, 44); s.joueur("B", "b", "B", 45, 44)
    s.joueur("C", "b", "C", 34, 41)
    s.joueur("D", "b", "D", 59, 37); s.joueur("E", "b", "E", 9, 37)
    s.joueur("F", "b", "F", 60, 23); s.joueur("J", "b", "J", 8, 23)
    s.joueur("H", "b", "H", 34, 29); s.joueur("I", "b", "I", 34, 18)
    s.balle("bal", "A")
    # 1. A -> B : on attire le bloc d'un côté
    s.temps_(bal=("passe", "B"), r7=(40, 36), r5=(30, 26), r6=(46, 26), r1=(18, 15), r2=(31, 13), r3=(45, 13), r4=(56, 15),
             C=(36, 39), D=(58, 34))
    # 2. B -> D : renversement sur le côté droit, le bloc glisse
    s.temps_(bal=("passe", "D"), D=(60, 31), r7=(46, 34), r6=(51, 27), r5=(36, 26), r4=(58, 17), r3=(47, 14),
             r2=(34, 13), r1=(21, 15), F=(55, 21), J=(15, 19), H=(40, 28), I=(36, 17))
    # 3. D -> F : passe dans la ligne, F reçoit entre le latéral et le milieu
    s.temps_(bal=("passe", "F"), F=(57, 22), D=(61, 28), r4=(57, 19), r6=(52, 24), r7=(50, 31),
             H=(44, 22), C=(38, 36))
    # 4. F rentre dans l'axe en conduite, D déborde à l'extérieur (appel du latéral)
    s.temps_(F=(52, 17, 56, 17), D=(65, 14, 65, 24), r4=(58, 17), r6=(49, 21), r3=(49, 13), H=(40, 20),
             I=(33, 14), J=(13, 12))
    # 5. F -> D lancé dans le dos du latéral, les attaquants entrent dans la surface
    s.temps_(bal=("passe", "D"), D=(63, 8), F=(50, 14), I=(41, 9), H=(34, 16.5), J=(19, 7),
             r4=(60, 11), r3=(47, 10), r2=(33, 9), r1=(25, 12), r5=(34, 20), r6=(45, 19), GR=(37, 3.4))
    # 6. D centre en retrait vers H, qui arrive lancé à la limite des 11 m
    s.temps_(bal=("passe", "H"), H=(34, 12.5), I=(41, 6), J=(17, 5), F=(52, 11), r2=(31, 7), r3=(46, 8), r5=(27, 15), r6=(42, 16))
    # 7. H frappe de volée / en une touche : but
    s.temps_(bal=("tir", 35.5, 1.2), GR=(30, 3.4), H=(34, 11))
    return fiche(
        id="fic-002", titre="Attaque placée 9 c 7 : débordement et centre",
        theme="tactique", categories=["U18", "Seniors"], niveau="confirmé", duree_min=25,
        joueurs={"min": 16, "max": 18}, surface="Demi-terrain 68 x 52 m, grand but",
        materiel=[{"nom": "ballons", "quantite": 8}, {"nom": "plots", "quantite": 6}, {"nom": "chasubles", "quantite": 9},
                  {"nom": "buts", "quantite": 1}],
        objectif="Faire circuler vers un côté, renverser, déborder et finir en multipliant les arrivées dans la surface.",
        organisation="9 attaquants (2 défenseurs, 1 milieu relayeur, 2 latéraux, 2 ailiers, 1 numéro 10, 1 avant-centre) contre un bloc de 7 (4-2-1) plus gardien. L'attaque démarre du côté du défenseur central, ballon au pied.",
        deroulement="Séquence imposée pour apprendre le geste : passe d'attirance, renversement vers le côté libre, passe dans la ligne vers l'ailier, ailier qui rentre dans l'axe, débordement du latéral, centre en retrait pour l'arrivée lancée. Les attaquants non ballon entrent dans la zone des 11 m (avant-centre au premier poteau, ailier opposé (J) au second, 10 à la limite). Puis jeu libre : même scénario sans séquence imposée, on compte les buts.",
        consignes=["Le renversement doit être rapide : au maximum 2 touches de balle.", "Le latéral déborde quand l'ailier rentre dans l'axe.", "Trois arrivées dans la surface : premier poteau, second poteau, point de penalty.", "L'éducateur regarde : le timing de l'appel, pas la vitesse de course."],
        variantes=[{"nom": "Défense réduite", "change": "Le bloc passe à 5 défenseurs (4-1) pour apprendre la séquence.", "difficulte": "plus facile"},
                   {"nom": "Pressing haut", "change": "Le 7 presse le porteur dans la zone de sortie.", "difficulte": "plus difficile"},
                   {"nom": "Centre côté gauche", "change": "Mêmes schémas, inversés (miroir du schéma).", "difficulte": ""}],
        mots_cles=["attaque placée", "centre", "débordement", "renversement", "9 contre 7", "finition"],
        schema_modele=s.json())


# ------------------------------------------------------------------ 3. Contre-attaque éclair
def contre():
    s = Schema(68, 52, demi=True)
    s.add("but", "but", 34, 0)
    s.joueur("GR", "j", "G", 34, 2.2)
    s.joueur("r1", "r", "1", 26, 19); s.joueur("r2", "r", "2", 40, 17); s.joueur("r3", "r", "3", 50, 23)
    s.joueur("A", "b", "A", 31, 44); s.joueur("B", "b", "B", 18, 40)
    s.joueur("C", "b", "C", 50, 40); s.joueur("D", "b", "D", 34, 33)
    s.balle("bal", "A")
    # 1. A récupère et sert D, B et C s'écartent en sprint
    s.temps_(bal=("passe", "D"), B=(10, 27), C=(58, 27), A=(32, 38), D=(34, 31), r1=(28, 17), r2=(38, 15), r3=(48, 19))
    # 2. D conduit vers l'axe pendant que les deux ailiers prennent la profondeur
    s.temps_(D=(34, 23), B=(8, 17), C=(60, 17), A=(33, 31), r1=(25, 14), r2=(36, 14), r3=(50, 15))
    # 3. D sert C dans le dos du défenseur ; B et A arrivent
    s.temps_(bal=("passe", "C"), C=(57, 10), B=(22, 9), A=(36, 20), D=(40, 17), r3=(51, 12), r2=(40, 10), r1=(28, 9), GR=(38, 2.2))
    # 4. C centre en retrait pour B
    s.temps_(bal=("passe", "B"), B=(30, 11), A=(38, 12), r2=(36, 8), r1=(27, 8), GR=(34, 2.2))
    # 5. B frappe
    s.temps_(bal=("tir", 31.5, 1.2), GR=(40, 2.2))
    return fiche(
        id="fic-003", titre="Contre-attaque éclair 4 contre 3",
        theme="tactique", categories=["U15", "U18", "Seniors"], niveau="confirmé", duree_min=15,
        joueurs={"min": 8, "max": 12}, surface="Demi-terrain 68 x 52 m, grand but",
        materiel=[{"nom": "ballons", "quantite": 6}, {"nom": "chasubles", "quantite": 7}, {"nom": "buts", "quantite": 1}],
        objectif="Quand on récupère le ballon, attaquer vite et à plusieurs : passe vers l'avant, écartement, profondeur, centre en retrait.",
        organisation="4 attaquants au niveau de la ligne médiane, 3 défenseurs et le gardien devant le but. Un entraîneur ou un défenseur donne le ballon à l'un des attaquants (simule la récupération).",
        deroulement="Les attaquants ont 12 secondes pour conclure. Les défenseurs jouent en repli défensif et ne peuvent pas presser avant la ligne médiane. Si les défenseurs récupèrent, ils marquent dans deux mini-buts à l'opposé. 6 à 8 passages puis rotation.",
        consignes=["Première passe vers l'avant, pas en retrait.", "Deux joueurs sprintent pour étirer la défense, un seul porte.", "Centre en retrait : le joueur arrive lancé, il ne s'arrête pas."],
        variantes=[{"nom": "Cinquième attaquant", "change": "Un 5e attaquant arrive en retard pour tenter de dépasser le ballon.", "difficulte": "plus facile"},
                   {"nom": "8 secondes", "change": "Conclure en 8 secondes au lieu de 12.", "difficulte": "plus difficile"}],
        mots_cles=["contre-attaque", "transition", "4 contre 3", "profondeur", "centre en retrait"],
        schema_modele=s.json())


FICHES = [sortie(), attaque(), contre()]
SEANCE = {
    "nom": "Séance fictive de démonstration - U18/Seniors (60 min)",
    "fictive": True, "source": SRC,
    "exercices": [{"id": "fic-001", "duree": 15, "variante": ""}, {"id": "fic-002", "duree": 25, "variante": ""},
                  {"id": "fic-003", "duree": 15, "variante": ""}],
}

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "fiches")
    os.makedirs(out, exist_ok=True)
    for f in FICHES:
        json.dump(f, open(os.path.join(out, f["id"] + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    json.dump(SEANCE, open(os.path.join(out, "seance_fictive.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print("ok", out)
