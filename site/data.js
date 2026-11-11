window.EXERCICES=[
 {
  "id": "ech-001",
  "titre": "Conservation 4 contre 2",
  "theme": "échauffement",
  "categories": [
   "U11",
   "U13",
   "U15"
  ],
  "public": [
   "filles",
   "garçons"
  ],
  "niveau": "débutant",
  "duree_min": 15,
  "joueurs": {
   "min": 6,
   "max": 12
  },
  "surface": "12 x 12 m par groupe de 6",
  "materiel": [
   {
    "nom": "ballon",
    "quantite": 1
   },
   {
    "nom": "plot",
    "quantite": 4
   },
   {
    "nom": "chasuble (2 couleurs)",
    "quantite": 6
   }
  ],
  "objectif": "Passer, se démarquer et lever la tête sous faible pression.",
  "organisation": "Groupes de 6 dans un carré : 4 joueurs à l'extérieur avec 1 ballon, 2 défenseurs à l'intérieur.",
  "deroulement": "Les 4 joueurs extérieurs gardent le ballon. Les 2 défenseurs essaient de l'intercepter. Le joueur qui perd le ballon, ou celui dont la passe est interceptée, devient défenseur. Changer les défenseurs toutes les 2 minutes.",
  "consignes": [
   "Lever la tête avant de passer.",
   "Se déplacer pour proposer un angle de passe."
  ],
  "variantes": [
   {
    "nom": "2 touches",
    "change": "Limiter à 2 touches de balle.",
    "difficulte": "plus difficile"
   },
   {
    "nom": "Jeu libre",
    "change": "Aucune limite de touches.",
    "difficulte": "plus facile"
   },
   {
    "nom": "Passe de plus",
    "change": "Après 6 passes consécutives, l'équipe marque 1 point.",
    "difficulte": "plus difficile",
    "materiel": "aucun changement"
   }
  ],
  "schema_modele": {
   "v": 3,
   "w": 12,
   "h": 12,
   "items": [
    {
     "t": "plot",
     "x": 72,
     "y": 22
    },
    {
     "t": "plot",
     "x": 228,
     "y": 22
    },
    {
     "t": "plot",
     "x": 72,
     "y": 178
    },
    {
     "t": "plot",
     "x": 228,
     "y": 178
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 150,
     "y": 22
    },
    {
     "t": "p",
     "c": "b",
     "l": "B",
     "x": 228,
     "y": 100
    },
    {
     "t": "p",
     "c": "b",
     "l": "C",
     "x": 150,
     "y": 178
    },
    {
     "t": "p",
     "c": "b",
     "l": "D",
     "x": 72,
     "y": 100
    },
    {
     "t": "p",
     "c": "r",
     "l": "1",
     "x": 134,
     "y": 84
    },
    {
     "t": "p",
     "c": "r",
     "l": "2",
     "x": 166,
     "y": 116
    },
    {
     "t": "ball",
     "x": 159,
     "y": 28,
     "o": 4
    }
   ],
   "temps": [
    {
     "moves": {
      "10": {
       "x": 237,
       "y": 106,
       "o": 5
      },
      "6": {
       "x": 169,
       "y": 178
      },
      "9": {
       "x": 185,
       "y": 111
      },
      "8": {
       "x": 162,
       "y": 89
      }
     }
    },
    {
     "moves": {
      "10": {
       "x": 178,
       "y": 184,
       "o": 6
      },
      "7": {
       "x": 72,
       "y": 119
      },
      "9": {
       "x": 180,
       "y": 131
      },
      "8": {
       "x": 164,
       "y": 116
      }
     }
    },
    {
     "moves": {
      "10": {
       "x": 81,
       "y": 125,
       "o": 7
      },
      "4": {
       "x": 131,
       "y": 22
      },
      "8": {
       "x": 136,
       "y": 117
      },
      "9": {
       "x": 148,
       "y": 127
      }
     }
    },
    {
     "moves": {
      "10": {
       "x": 140,
       "y": 28,
       "o": 4
      },
      "5": {
       "x": 228,
       "y": 84
      },
      "8": {
       "x": 134,
       "y": 88
      },
      "9": {
       "x": 143,
       "y": 96
      }
     }
    }
   ]
  }
 },
 {
  "id": "ech-002",
  "titre": "Remise sans contrôle",
  "theme": "échauffement",
  "categories": [
   "U9",
   "U11",
   "U13",
   "U15"
  ],
  "public": [
   "filles",
   "garçons"
  ],
  "niveau": "débutant",
  "duree_min": 15,
  "joueurs": {
   "min": 6,
   "max": 16
  },
  "surface": "20 x 20 m",
  "materiel": [
   {
    "nom": "ballon",
    "quantite": 8
   },
   {
    "nom": "plot",
    "quantite": 4
   }
  ],
  "objectif": "Conduire, passer et remettre en une touche de balle.",
  "organisation": "Moitié des joueurs avec un ballon, l'autre moitié sans, dans un carré.",
  "deroulement": "Le porteur conduit puis passe à un joueur sans ballon, qui lui remet en une touche. Les joueurs sans ballon trottinent pour se rendre disponibles. On change les rôles régulièrement.",
  "consignes": [
   "Passes dosées et précises.",
   "Les joueurs sans ballon bougent.",
   "Remise en une touche, sans contrôle."
  ],
  "variantes": [
   {
    "nom": "Deuxième pied",
    "change": "Passer et remettre avec le pied faible.",
    "difficulte": "plus difficile"
   }
  ],
  "schema_modele": {
   "v": 3,
   "w": 20,
   "h": 20,
   "items": [
    {
     "t": "plot",
     "x": 72,
     "y": 22
    },
    {
     "t": "plot",
     "x": 228,
     "y": 22
    },
    {
     "t": "plot",
     "x": 72,
     "y": 178
    },
    {
     "t": "plot",
     "x": 228,
     "y": 178
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 95,
     "y": 61
    },
    {
     "t": "p",
     "c": "b",
     "l": "B",
     "x": 150,
     "y": 45
    },
    {
     "t": "ball",
     "x": 104,
     "y": 67,
     "o": 4
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 205,
     "y": 77
    },
    {
     "t": "p",
     "c": "b",
     "l": "B",
     "x": 197,
     "y": 139
    },
    {
     "t": "ball",
     "x": 214,
     "y": 83,
     "o": 7
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 103,
     "y": 147
    },
    {
     "t": "p",
     "c": "b",
     "l": "B",
     "x": 150,
     "y": 116
    },
    {
     "t": "ball",
     "x": 112,
     "y": 153,
     "o": 10
    }
   ],
   "temps": [
    {
     "moves": {
      "4": {
       "x": 115,
       "y": 56
      },
      "5": {
       "x": 156,
       "y": 53
      },
      "7": {
       "x": 202,
       "y": 98
      },
      "8": {
       "x": 203,
       "y": 147
      },
      "10": {
       "x": 120,
       "y": 136
      },
      "11": {
       "x": 156,
       "y": 123
      }
     }
    },
    {
     "moves": {
      "6": {
       "x": 165,
       "y": 59,
       "o": 5
      },
      "9": {
       "x": 212,
       "y": 153,
       "o": 8
      },
      "12": {
       "x": 165,
       "y": 129,
       "o": 11
      }
     }
    },
    {
     "moves": {
      "6": {
       "x": 124,
       "y": 62,
       "o": 4
      },
      "9": {
       "x": 211,
       "y": 104,
       "o": 7
      },
      "12": {
       "x": 129,
       "y": 142,
       "o": 10
      }
     }
    }
   ]
  }
 },
 {
  "id": "ech-003",
  "titre": "Le une-deux",
  "theme": "échauffement",
  "categories": [
   "U9",
   "U11",
   "U13",
   "U15"
  ],
  "public": [
   "filles",
   "garçons"
  ],
  "niveau": "confirmé",
  "duree_min": 15,
  "joueurs": {
   "min": 6,
   "max": 16
  },
  "surface": "30 x 20 m",
  "materiel": [
   {
    "nom": "ballon",
    "quantite": 8
   },
   {
    "nom": "plot",
    "quantite": 4
   }
  ],
  "objectif": "Faire un une-deux avec appel de balle.",
  "organisation": "Moitié des joueurs avec ballon, l'autre sans, dans un rectangle.",
  "deroulement": "A passe à B, puis fait un appel de balle en sprintant ; B lui remet en une touche dans la course. Si le joueur sans ballon ne fait pas d'appel, le porteur garde son ballon et change de partenaire.",
  "consignes": [
   "Passes dosées et précises.",
   "L'appel de balle est franc et rapide.",
   "Remise en une touche dans la course."
  ],
  "variantes": [
   {
    "nom": "Un deuxième ballon",
    "change": "Ajouter 2 ballons dans le jeu.",
    "difficulte": "plus difficile"
   }
  ],
  "schema_modele": {
   "v": 3,
   "w": 30,
   "h": 20,
   "items": [
    {
     "t": "plot",
     "x": 33,
     "y": 22
    },
    {
     "t": "plot",
     "x": 267,
     "y": 22
    },
    {
     "t": "plot",
     "x": 33,
     "y": 178
    },
    {
     "t": "plot",
     "x": 267,
     "y": 178
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 61,
     "y": 155
    },
    {
     "t": "p",
     "c": "b",
     "l": "B",
     "x": 122,
     "y": 155
    },
    {
     "t": "ball",
     "x": 70,
     "y": 161,
     "o": 4
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 173,
     "y": 155
    },
    {
     "t": "p",
     "c": "b",
     "l": "B",
     "x": 234,
     "y": 155
    },
    {
     "t": "ball",
     "x": 182,
     "y": 161,
     "o": 7
    }
   ],
   "temps": [
    {
     "moves": {
      "6": {
       "x": 131,
       "y": 161,
       "o": 5
      },
      "9": {
       "x": 243,
       "y": 161,
       "o": 8
      }
     }
    },
    {
     "moves": {
      "4": {
       "x": 108,
       "y": 84
      },
      "6": {
       "x": 117,
       "y": 90,
       "o": 4
      },
      "7": {
       "x": 216,
       "y": 84
      },
      "9": {
       "x": 225,
       "y": 90,
       "o": 7
      }
     }
    },
    {
     "moves": {
      "4": {
       "x": 127,
       "y": 45
      },
      "7": {
       "x": 234,
       "y": 45
      }
     }
    }
   ]
  }
 },
 {
  "id": "ech-004",
  "titre": "Le jeu des portes",
  "theme": "échauffement",
  "categories": [
   "U9",
   "U11",
   "U13",
   "U15",
   "U17"
  ],
  "public": [
   "filles",
   "garçons"
  ],
  "niveau": "débutant",
  "duree_min": 15,
  "joueurs": {
   "min": 8,
   "max": 14
  },
  "surface": "40 x 30 m",
  "materiel": [
   {
    "nom": "ballon",
    "quantite": 1
   },
   {
    "nom": "plot",
    "quantite": 12
   },
   {
    "nom": "chasuble (2 couleurs)",
    "quantite": 7
   }
  ],
  "objectif": "Lever la tête, conduire et passer en jeu.",
  "organisation": "Match 5 contre 5 (ou plus) sur un terrain avec 6 portes de 2 m.",
  "deroulement": "Pour marquer, on conduit le ballon à travers une porte. Après un point, on continue mais on ne peut pas marquer 2 fois de suite par la même porte.",
  "consignes": [
   "Lever la tête.",
   "Aider le porteur du ballon."
  ],
  "variantes": [
   {
    "nom": "Passe obligatoire",
    "change": "On passe le ballon par la porte à un coéquipier.",
    "difficulte": "plus difficile"
   }
  ],
  "schema_modele": {
   "v": 3,
   "w": 40,
   "h": 30,
   "items": [
    {
     "t": "plot",
     "x": 69,
     "y": 61
    },
    {
     "t": "plot",
     "x": 86,
     "y": 61
    },
    {
     "t": "plot",
     "x": 142,
     "y": 45
    },
    {
     "t": "plot",
     "x": 158,
     "y": 45
    },
    {
     "t": "plot",
     "x": 214,
     "y": 69
    },
    {
     "t": "plot",
     "x": 231,
     "y": 69
    },
    {
     "t": "plot",
     "x": 79,
     "y": 155
    },
    {
     "t": "plot",
     "x": 96,
     "y": 155
    },
    {
     "t": "plot",
     "x": 152,
     "y": 147
    },
    {
     "t": "plot",
     "x": 169,
     "y": 147
    },
    {
     "t": "plot",
     "x": 214,
     "y": 155
    },
    {
     "t": "plot",
     "x": 231,
     "y": 155
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 133,
     "y": 100
    },
    {
     "t": "p",
     "c": "b",
     "l": "B",
     "x": 192,
     "y": 108
    },
    {
     "t": "p",
     "c": "b",
     "l": "C",
     "x": 98,
     "y": 116
    },
    {
     "t": "p",
     "c": "r",
     "l": "1",
     "x": 160,
     "y": 84
    },
    {
     "t": "p",
     "c": "r",
     "l": "2",
     "x": 202,
     "y": 131
    },
    {
     "t": "p",
     "c": "r",
     "l": "3",
     "x": 108,
     "y": 77
    },
    {
     "t": "ball",
     "x": 142,
     "y": 106,
     "o": 12
    }
   ],
   "temps": [
    {
     "moves": {
      "12": {
       "x": 150,
       "y": 33
      },
      "13": {
       "x": 183,
       "y": 53
      },
      "15": {
       "x": 156,
       "y": 56
      },
      "17": {
       "x": 129,
       "y": 53
      }
     }
    },
    {
     "moves": {
      "18": {
       "x": 192,
       "y": 59,
       "o": 13
      },
      "15": {
       "x": 171,
       "y": 50
      }
     }
    },
    {
     "moves": {
      "13": {
       "x": 225,
       "y": 84
      },
      "16": {
       "x": 217,
       "y": 100
      },
      "14": {
       "x": 150,
       "y": 84
      }
     }
    }
   ]
  }
 },
 {
  "id": "ech-005",
  "titre": "8 contre 4",
  "theme": "échauffement",
  "categories": [
   "U9",
   "U11",
   "U13",
   "U15",
   "U17"
  ],
  "public": [
   "filles",
   "garçons"
  ],
  "niveau": "débutant",
  "duree_min": 15,
  "joueurs": {
   "min": 12,
   "max": 12
  },
  "surface": "25 x 25 m",
  "materiel": [
   {
    "nom": "ballon",
    "quantite": 1
   },
   {
    "nom": "plot",
    "quantite": 8
   },
   {
    "nom": "chasuble (2 couleurs)",
    "quantite": 4
   }
  ],
  "objectif": "Conserver le ballon en supériorité numérique.",
  "organisation": "Carré de 25 x 25 m. 8 joueurs jouent contre 4 qui essaient de récupérer.",
  "deroulement": "Les 8 joueurs sont répartis dans le carré et gardent le ballon. Les 4 défenseurs le récupèrent. Si l'équipe garde le ballon, les défenseurs changent régulièrement.",
  "consignes": [
   "L'équipe de 8 est limitée à 2 touches.",
   "Jeu libre pour l'équipe de 4."
  ],
  "variantes": [
   {
    "nom": "Jeu libre",
    "change": "Pas de limite de touches.",
    "difficulte": "plus facile"
   },
   {
    "nom": "2 touches",
    "change": "Limiter à 2 touches de balle.",
    "difficulte": "plus difficile"
   }
  ],
  "schema_modele": {
   "v": 3,
   "w": 25,
   "h": 25,
   "items": [
    {
     "t": "plot",
     "x": 72,
     "y": 22
    },
    {
     "t": "plot",
     "x": 228,
     "y": 22
    },
    {
     "t": "plot",
     "x": 72,
     "y": 178
    },
    {
     "t": "plot",
     "x": 228,
     "y": 178
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 150,
     "y": 31
    },
    {
     "t": "p",
     "c": "b",
     "l": "B",
     "x": 212,
     "y": 41
    },
    {
     "t": "p",
     "c": "b",
     "l": "C",
     "x": 219,
     "y": 108
    },
    {
     "t": "p",
     "c": "b",
     "l": "D",
     "x": 205,
     "y": 166
    },
    {
     "t": "p",
     "c": "b",
     "l": "E",
     "x": 150,
     "y": 169
    },
    {
     "t": "p",
     "c": "b",
     "l": "F",
     "x": 91,
     "y": 159
    },
    {
     "t": "p",
     "c": "b",
     "l": "G",
     "x": 81,
     "y": 100
    },
    {
     "t": "p",
     "c": "b",
     "l": "H",
     "x": 95,
     "y": 41
    },
    {
     "t": "p",
     "c": "r",
     "l": "1",
     "x": 134,
     "y": 77
    },
    {
     "t": "p",
     "c": "r",
     "l": "2",
     "x": 169,
     "y": 81
    },
    {
     "t": "p",
     "c": "r",
     "l": "3",
     "x": 131,
     "y": 119
    },
    {
     "t": "p",
     "c": "r",
     "l": "4",
     "x": 166,
     "y": 123
    },
    {
     "t": "ball",
     "x": 159,
     "y": 37,
     "o": 4
    }
   ],
   "temps": [
    {
     "moves": {
      "16": {
       "x": 221,
       "y": 47,
       "o": 5
      },
      "13": {
       "x": 182,
       "y": 69
      },
      "12": {
       "x": 157,
       "y": 66
      }
     }
    },
    {
     "moves": {
      "16": {
       "x": 228,
       "y": 114,
       "o": 6
      },
      "13": {
       "x": 193,
       "y": 81
      },
      "15": {
       "x": 182,
       "y": 118
      }
     }
    },
    {
     "moves": {
      "16": {
       "x": 214,
       "y": 172,
       "o": 7
      },
      "15": {
       "x": 189,
       "y": 132
      },
      "13": {
       "x": 197,
       "y": 106
      }
     }
    },
    {
     "moves": {
      "16": {
       "x": 159,
       "y": 175,
       "o": 8
      },
      "14": {
       "x": 137,
       "y": 134
      },
      "15": {
       "x": 177,
       "y": 143
      }
     }
    },
    {
     "moves": {
      "16": {
       "x": 100,
       "y": 165,
       "o": 9
      },
      "14": {
       "x": 123,
       "y": 142
      },
      "15": {
       "x": 151,
       "y": 148
      }
     }
    },
    {
     "moves": {
      "16": {
       "x": 90,
       "y": 106,
       "o": 10
      },
      "14": {
       "x": 110,
       "y": 129
      },
      "12": {
       "x": 134,
       "y": 76
      }
     }
    },
    {
     "moves": {
      "16": {
       "x": 104,
       "y": 47,
       "o": 11
      },
      "12": {
       "x": 122,
       "y": 66
      },
      "14": {
       "x": 106,
       "y": 103
      }
     }
    },
    {
     "moves": {
      "16": {
       "x": 159,
       "y": 37,
       "o": 4
      },
      "12": {
       "x": 130,
       "y": 56
      },
      "14": {
       "x": 119,
       "y": 81
      }
     }
    }
   ]
  }
 },
 {
  "id": "ech-006",
  "titre": "Conservation avec jokers",
  "theme": "échauffement",
  "categories": [
   "U11",
   "U13",
   "U15",
   "U17"
  ],
  "public": [
   "filles",
   "garçons"
  ],
  "niveau": "confirmé",
  "duree_min": 15,
  "joueurs": {
   "min": 12,
   "max": 12
  },
  "surface": "40 x 35 m",
  "materiel": [
   {
    "nom": "ballon",
    "quantite": 1
   },
   {
    "nom": "plot",
    "quantite": 4
   },
   {
    "nom": "chasuble (2 couleurs)",
    "quantite": 10
   }
  ],
  "objectif": "Conserver le ballon en supériorité grâce aux jokers.",
  "organisation": "2 équipes de 5 joueurs et 2 jokers (une autre couleur) qui jouent avec l'équipe qui a le ballon.",
  "deroulement": "Chaque équipe garde le ballon. Après 7 passes consécutives sans perte, l'équipe marque 1 point. On change les jokers régulièrement.",
  "consignes": [
   "Se démarquer pour aider le porteur.",
   "Garder la bonne distance."
  ],
  "variantes": [
   {
    "nom": "Passe de plus",
    "change": "Après 7 passes, chaque passe de plus donne 1 point.",
    "difficulte": "plus difficile"
   }
  ],
  "schema_modele": {
   "v": 3,
   "w": 40,
   "h": 35,
   "items": [
    {
     "t": "plot",
     "x": 61,
     "y": 22
    },
    {
     "t": "plot",
     "x": 239,
     "y": 22
    },
    {
     "t": "plot",
     "x": 61,
     "y": 178
    },
    {
     "t": "plot",
     "x": 239,
     "y": 178
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 105,
     "y": 69
    },
    {
     "t": "p",
     "c": "b",
     "l": "B",
     "x": 150,
     "y": 116
    },
    {
     "t": "p",
     "c": "b",
     "l": "C",
     "x": 200,
     "y": 61
    },
    {
     "t": "p",
     "c": "b",
     "l": "D",
     "x": 132,
     "y": 155
    },
    {
     "t": "p",
     "c": "b",
     "l": "E",
     "x": 168,
     "y": 41
    },
    {
     "t": "p",
     "c": "r",
     "l": "1",
     "x": 97,
     "y": 116
    },
    {
     "t": "p",
     "c": "r",
     "l": "2",
     "x": 141,
     "y": 69
    },
    {
     "t": "p",
     "c": "r",
     "l": "3",
     "x": 203,
     "y": 116
    },
    {
     "t": "p",
     "c": "r",
     "l": "4",
     "x": 114,
     "y": 41
    },
    {
     "t": "p",
     "c": "r",
     "l": "5",
     "x": 186,
     "y": 159
    },
    {
     "t": "p",
     "c": "j",
     "l": "J",
     "x": 61,
     "y": 100
    },
    {
     "t": "p",
     "c": "j",
     "l": "J",
     "x": 239,
     "y": 100
    },
    {
     "t": "ball",
     "x": 114,
     "y": 75,
     "o": 4
    }
   ],
   "temps": [
    {
     "moves": {
      "5": {
       "x": 152,
       "y": 127
      },
      "16": {
       "x": 161,
       "y": 133,
       "o": 5
      },
      "13": {
       "x": 176,
       "y": 149
      },
      "11": {
       "x": 188,
       "y": 119
      }
     }
    },
    {
     "moves": {
      "16": {
       "x": 70,
       "y": 106,
       "o": 14
      },
      "9": {
       "x": 86,
       "y": 111
      },
      "12": {
       "x": 98,
       "y": 59
      }
     }
    },
    {
     "moves": {
      "7": {
       "x": 120,
       "y": 156
      },
      "16": {
       "x": 129,
       "y": 162,
       "o": 7
      },
      "9": {
       "x": 96,
       "y": 124
      },
      "13": {
       "x": 159,
       "y": 151
      }
     }
    },
    {
     "moves": {
      "16": {
       "x": 248,
       "y": 106,
       "o": 15
      },
      "11": {
       "x": 203,
       "y": 113
      },
      "13": {
       "x": 183,
       "y": 136
      }
     }
    },
    {
     "moves": {
      "6": {
       "x": 199,
       "y": 50
      },
      "16": {
       "x": 208,
       "y": 56,
       "o": 6
      },
      "10": {
       "x": 158,
       "y": 63
      },
      "11": {
       "x": 202,
       "y": 94
      }
     }
    },
    {
     "moves": {
      "8": {
       "x": 173,
       "y": 31
      },
      "16": {
       "x": 182,
       "y": 37,
       "o": 8
      },
      "10": {
       "x": 162,
       "y": 53
      },
      "11": {
       "x": 193,
       "y": 75
      }
     }
    },
    {
     "moves": {
      "4": {
       "x": 112,
       "y": 78
      },
      "16": {
       "x": 121,
       "y": 84,
       "o": 4
      },
      "12": {
       "x": 102,
       "y": 65
      },
      "9": {
       "x": 101,
       "y": 110
      }
     }
    }
   ]
  }
 },
 {
  "id": "ech-007",
  "titre": "Grand jeu et gardiens",
  "theme": "échauffement",
  "categories": [
   "U13",
   "U15",
   "U17",
   "seniors"
  ],
  "public": [
   "filles",
   "garçons"
  ],
  "niveau": "confirmé",
  "duree_min": 15,
  "joueurs": {
   "min": 12,
   "max": 14
  },
  "surface": "60 x 40 m",
  "materiel": [
   {
    "nom": "ballon",
    "quantite": 1
   },
   {
    "nom": "plot",
    "quantite": 8
   },
   {
    "nom": "chasuble (2 couleurs)",
    "quantite": 12
   }
  ],
  "objectif": "Jouer vers l'avant et relancer en profondeur avec le gardien.",
  "organisation": "Terrain de 60 x 40 m avec une zone à chaque extrémité. 6 contre 6 (ou plus). Les gardiens sont dans la zone de l'équipe adverse.",
  "deroulement": "Pour marquer, une équipe fait parvenir un ballon aérien au gardien dans la zone, sans qu'il le lâche. Jeu libre, avec un but sur six mètres relancé à la main.",
  "consignes": [
   "Jeu libre.",
   "Relance du gardien à la main.",
   "Pas de corner : relance du gardien."
  ],
  "variantes": [
   {
    "nom": "Passe longue",
    "change": "Pour marquer, la passe doit être longue et aérienne.",
    "difficulte": "plus difficile"
   }
  ],
  "schema_modele": {
   "v": 3,
   "w": 60,
   "h": 40,
   "items": [
    {
     "t": "zone",
     "x": 33,
     "y": 22,
     "w": 234,
     "h": 28
    },
    {
     "t": "zone",
     "x": 33,
     "y": 150,
     "w": 234,
     "h": 28
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 103,
     "y": 116
    },
    {
     "t": "p",
     "c": "b",
     "l": "B",
     "x": 162,
     "y": 100
    },
    {
     "t": "p",
     "c": "b",
     "l": "C",
     "x": 208,
     "y": 119
    },
    {
     "t": "p",
     "c": "r",
     "l": "1",
     "x": 103,
     "y": 84
    },
    {
     "t": "p",
     "c": "r",
     "l": "2",
     "x": 162,
     "y": 72
    },
    {
     "t": "p",
     "c": "r",
     "l": "3",
     "x": 208,
     "y": 88
    },
    {
     "t": "p",
     "c": "j",
     "l": "G",
     "x": 150,
     "y": 34
    },
    {
     "t": "p",
     "c": "j",
     "l": "G",
     "x": 150,
     "y": 166
    },
    {
     "t": "ball",
     "x": 112,
     "y": 122,
     "o": 2
    }
   ],
   "temps": [
    {
     "moves": {
      "3": {
       "x": 150,
       "y": 108
      },
      "10": {
       "x": 159,
       "y": 114,
       "o": 3
      },
      "6": {
       "x": 158,
       "y": 83
      },
      "4": {
       "x": 220,
       "y": 77
      }
     }
    },
    {
     "moves": {
      "10": {
       "x": 229,
       "y": 83,
       "o": 4
      },
      "7": {
       "x": 212,
       "y": 85
      },
      "6": {
       "x": 177,
       "y": 81
      }
     }
    },
    {
     "moves": {
      "10": {
       "x": 159,
       "y": 40,
       "o": 8
      }
     }
    }
   ]
  }
 },
 {
  "id": "ech-008",
  "titre": "Stop-ball 6 contre 6",
  "theme": "échauffement",
  "categories": [
   "U11",
   "U13",
   "U15",
   "U17"
  ],
  "public": [
   "filles",
   "garçons"
  ],
  "niveau": "débutant",
  "duree_min": 15,
  "joueurs": {
   "min": 10,
   "max": 14
  },
  "surface": "50 x 30 m",
  "materiel": [
   {
    "nom": "ballon",
    "quantite": 1
   },
   {
    "nom": "plot",
    "quantite": 8
   },
   {
    "nom": "chasuble (2 couleurs)",
    "quantite": 6
   }
  ],
  "objectif": "Jouer vers l'avant et prendre des informations.",
  "organisation": "Terrain de 50 x 30 m avec une zone à chaque extrémité. 6 contre 6.",
  "deroulement": "Pour marquer, on arrête le ballon dans la zone adverse (sur la ligne). Il n'y a pas de chasuble sur les joueurs : bien définir les équipes avant de commencer.",
  "consignes": [
   "Jeu libre.",
   "Prendre ses informations avant de recevoir."
  ],
  "variantes": [
   {
    "nom": "Contrainte",
    "change": "Interdiction de dribbler plus de 3 secondes.",
    "difficulte": "plus difficile"
   }
  ],
  "schema_modele": {
   "v": 3,
   "w": 50,
   "h": 30,
   "items": [
    {
     "t": "zone",
     "x": 20,
     "y": 22,
     "w": 260,
     "h": 23
    },
    {
     "t": "zone",
     "x": 20,
     "y": 155,
     "w": 260,
     "h": 23
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 72,
     "y": 131
    },
    {
     "t": "p",
     "c": "b",
     "l": "B",
     "x": 150,
     "y": 108
    },
    {
     "t": "p",
     "c": "b",
     "l": "C",
     "x": 228,
     "y": 116
    },
    {
     "t": "p",
     "c": "r",
     "l": "1",
     "x": 98,
     "y": 92
    },
    {
     "t": "p",
     "c": "r",
     "l": "2",
     "x": 163,
     "y": 77
    },
    {
     "t": "p",
     "c": "r",
     "l": "3",
     "x": 223,
     "y": 84
    },
    {
     "t": "ball",
     "x": 81,
     "y": 137,
     "o": 2
    }
   ],
   "temps": [
    {
     "moves": {
      "8": {
       "x": 159,
       "y": 114,
       "o": 3
      },
      "4": {
       "x": 233,
       "y": 77
      },
      "6": {
       "x": 159,
       "y": 86
      }
     }
    },
    {
     "moves": {
      "8": {
       "x": 242,
       "y": 83,
       "o": 4
      },
      "7": {
       "x": 226,
       "y": 82
      },
      "6": {
       "x": 181,
       "y": 83
      }
     }
    },
    {
     "moves": {
      "4": {
       "x": 241,
       "y": 34
      },
      "7": {
       "x": 232,
       "y": 63
      }
     }
    }
   ]
  }
 },
 {
  "id": "tac-001",
  "titre": "Duel 1 contre 1 et dribble",
  "theme": "tactique",
  "categories": [
   "U11",
   "U13",
   "U15",
   "U17"
  ],
  "public": [
   "filles",
   "garçons"
  ],
  "niveau": "débutant",
  "duree_min": 15,
  "joueurs": {
   "min": 4,
   "max": 12
  },
  "surface": "15 x 12 m avec un mini-but",
  "materiel": [
   {
    "nom": "ballon",
    "quantite": 3
   },
   {
    "nom": "plot",
    "quantite": 6
   },
   {
    "nom": "mini-but",
    "quantite": 1
   },
   {
    "nom": "chasuble (2 couleurs)",
    "quantite": 6
   }
  ],
  "objectif": "Dribbler pour passer un adversaire, puis finir dans le but.",
  "organisation": "Par duos : 1 attaquant avec ballon, 1 défenseur face à lui. Un mini-but est placé au fond, une zone de tir est délimitée devant par des plots.",
  "deroulement": "L'attaquant dribble le défenseur et tire quand il est dans la zone de tir. Le défenseur ne peut pas entrer dans la zone de tir. Après chaque action, les rôles s'inversent. 3 duels en même temps sur le même but, en laissant de l'espace.",
  "consignes": [
   "Attaquant : tromper l'adversaire, changer de rythme et de direction.",
   "Protéger son ballon avec le corps.",
   "Éducateur : observer le choix du moment pour accélérer."
  ],
  "variantes": [
   {
    "nom": "Défenseur actif",
    "change": "Le défenseur peut tacler seulement après 3 secondes.",
    "difficulte": "plus facile"
   },
   {
    "nom": "Temps limité",
    "change": "L'attaquant doit tirer en 5 secondes.",
    "difficulte": "plus difficile"
   },
   {
    "nom": "Rotation",
    "change": "Le gagnant du duel monte sur le terrain voisin, le perdant descend.",
    "difficulte": "plus difficile",
    "materiel": "2e mini-but"
   }
  ],
  "schema_modele": {
   "v": 3,
   "w": 15,
   "h": 12,
   "items": [
    {
     "t": "but",
     "x": 150,
     "y": 27
    },
    {
     "t": "zone",
     "x": 62,
     "y": 45,
     "w": 176,
     "h": 31
    },
    {
     "t": "plot",
     "x": 72,
     "y": 173
    },
    {
     "t": "p",
     "c": "r",
     "l": "D",
     "x": 92,
     "y": 116
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 92,
     "y": 162
    },
    {
     "t": "ball",
     "x": 101,
     "y": 168,
     "o": 4
    },
    {
     "t": "plot",
     "x": 130,
     "y": 173
    },
    {
     "t": "p",
     "c": "r",
     "l": "D",
     "x": 150,
     "y": 116
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 150,
     "y": 162
    },
    {
     "t": "ball",
     "x": 159,
     "y": 168,
     "o": 8
    },
    {
     "t": "plot",
     "x": 189,
     "y": 173
    },
    {
     "t": "p",
     "c": "r",
     "l": "D",
     "x": 208,
     "y": 116
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 208,
     "y": 162
    },
    {
     "t": "ball",
     "x": 217,
     "y": 168,
     "o": 12
    }
   ],
   "temps": [
    {
     "moves": {
      "4": {
       "x": 78,
       "y": 128
      },
      "3": {
       "x": 82,
       "y": 109
      },
      "8": {
       "x": 136,
       "y": 128
      },
      "7": {
       "x": 140,
       "y": 109
      },
      "12": {
       "x": 195,
       "y": 128
      },
      "11": {
       "x": 199,
       "y": 109
      }
     }
    },
    {
     "moves": {
      "4": {
       "x": 101,
       "y": 69
      },
      "3": {
       "x": 92,
       "y": 88
      },
      "8": {
       "x": 160,
       "y": 69
      },
      "7": {
       "x": 150,
       "y": 88
      },
      "12": {
       "x": 218,
       "y": 69
      },
      "11": {
       "x": 208,
       "y": 88
      }
     }
    },
    {
     "moves": {
      "5": {
       "x": 144,
       "y": 30,
       "o": null
      },
      "9": {
       "x": 150,
       "y": 30,
       "o": null
      },
      "13": {
       "x": 156,
       "y": 30,
       "o": null
      }
     }
    }
   ]
  }
 },
 {
  "id": "tac-002",
  "titre": "Duel 1 contre 1 stop-ball",
  "theme": "tactique",
  "categories": [
   "U11",
   "U13",
   "U15",
   "U17"
  ],
  "public": [
   "filles",
   "garçons"
  ],
  "niveau": "débutant",
  "duree_min": 15,
  "joueurs": {
   "min": 8,
   "max": 16
  },
  "surface": "4 terrains de 12 x 6 m",
  "materiel": [
   {
    "nom": "ballon",
    "quantite": 4
   },
   {
    "nom": "plot",
    "quantite": 16
   }
  ],
  "objectif": "Dribbler son adversaire pour arrêter le ballon dans l'en-but.",
  "organisation": "Plusieurs terrains de 12 x 6 m avec une zone de 2 m aux extrémités. Un duel 1 contre 1 sur chaque terrain, matchs de 1 min 30.",
  "deroulement": "Pour marquer, le joueur doit arrêter le ballon dans l'en-but adverse. Le vainqueur monte d'un terrain et le perdant descend ; ceux des terrains aux extrémités ne changent pas de terrain.",
  "consignes": [
   "Utiliser les techniques de dribble et de débordement.",
   "Protéger son ballon."
  ],
  "variantes": [
   {
    "nom": "Défenseur actif",
    "change": "Le défenseur peut tacler seulement après 3 secondes.",
    "difficulte": "plus facile"
   }
  ],
  "schema_modele": {
   "v": 3,
   "w": 12,
   "h": 24,
   "items": [
    {
     "t": "zone",
     "x": 111,
     "y": 22,
     "w": 78,
     "h": 39
    },
    {
     "t": "zone",
     "x": 111,
     "y": 22,
     "w": 13,
     "h": 39
    },
    {
     "t": "zone",
     "x": 176,
     "y": 22,
     "w": 13,
     "h": 39
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 130,
     "y": 42
    },
    {
     "t": "p",
     "c": "r",
     "l": "D",
     "x": 162,
     "y": 42
    },
    {
     "t": "ball",
     "x": 139,
     "y": 48,
     "o": 3
    },
    {
     "t": "zone",
     "x": 111,
     "y": 61,
     "w": 78,
     "h": 39
    },
    {
     "t": "zone",
     "x": 111,
     "y": 61,
     "w": 13,
     "h": 39
    },
    {
     "t": "zone",
     "x": 176,
     "y": 61,
     "w": 13,
     "h": 39
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 130,
     "y": 80
    },
    {
     "t": "p",
     "c": "r",
     "l": "D",
     "x": 162,
     "y": 80
    },
    {
     "t": "ball",
     "x": 139,
     "y": 86,
     "o": 9
    },
    {
     "t": "zone",
     "x": 111,
     "y": 100,
     "w": 78,
     "h": 39
    },
    {
     "t": "zone",
     "x": 111,
     "y": 100,
     "w": 13,
     "h": 39
    },
    {
     "t": "zone",
     "x": 176,
     "y": 100,
     "w": 13,
     "h": 39
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 130,
     "y": 120
    },
    {
     "t": "p",
     "c": "r",
     "l": "D",
     "x": 162,
     "y": 120
    },
    {
     "t": "ball",
     "x": 139,
     "y": 126,
     "o": 15
    },
    {
     "t": "zone",
     "x": 111,
     "y": 139,
     "w": 78,
     "h": 39
    },
    {
     "t": "zone",
     "x": 111,
     "y": 139,
     "w": 13,
     "h": 39
    },
    {
     "t": "zone",
     "x": 176,
     "y": 139,
     "w": 13,
     "h": 39
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 130,
     "y": 158
    },
    {
     "t": "p",
     "c": "r",
     "l": "D",
     "x": 162,
     "y": 158
    },
    {
     "t": "ball",
     "x": 139,
     "y": 164,
     "o": 21
    }
   ],
   "temps": [
    {
     "moves": {
      "3": {
       "x": 148,
       "y": 32
      },
      "4": {
       "x": 158,
       "y": 34
      },
      "9": {
       "x": 148,
       "y": 71
      },
      "10": {
       "x": 158,
       "y": 73
      },
      "15": {
       "x": 148,
       "y": 110
      },
      "16": {
       "x": 158,
       "y": 112
      },
      "21": {
       "x": 148,
       "y": 149
      },
      "22": {
       "x": 158,
       "y": 151
      }
     }
    },
    {
     "moves": {
      "3": {
       "x": 181,
       "y": 52
      },
      "4": {
       "x": 167,
       "y": 45
      },
      "9": {
       "x": 181,
       "y": 91
      },
      "10": {
       "x": 167,
       "y": 84
      },
      "15": {
       "x": 181,
       "y": 130
      },
      "16": {
       "x": 167,
       "y": 123
      },
      "21": {
       "x": 181,
       "y": 169
      },
      "22": {
       "x": 167,
       "y": 162
      }
     }
    }
   ]
  }
 },
 {
  "id": "tec-001",
  "titre": "Contrôle orienté et passe",
  "theme": "technique",
  "categories": [
   "U9",
   "U11",
   "U13",
   "U15"
  ],
  "public": [
   "filles",
   "garçons"
  ],
  "niveau": "débutant",
  "duree_min": 15,
  "joueurs": {
   "min": 4,
   "max": 12
  },
  "surface": "15 x 15 m",
  "materiel": [
   {
    "nom": "ballon",
    "quantite": 2
   },
   {
    "nom": "plot",
    "quantite": 8
   }
  ],
  "objectif": "Contrôler le ballon en changeant de direction, puis passer précisément.",
  "organisation": "Par groupes de 4 : 4 plots forment un carré, un joueur à chaque plot, 2 ballons dans le groupe.",
  "deroulement": "Le joueur A passe à B. B contrôle en tournant à 90° vers C et lui passe. C fait de même vers D, et ainsi de suite. Après sa passe, chacun reste sur son plot. Changer de sens au signal de l'éducateur.",
  "consignes": [
   "Contrôler avec l'intérieur du pied, puis avec l'extérieur.",
   "Passer à plat, au pied du partenaire.",
   "Regarder le terrain avant la réception."
  ],
  "variantes": [
   {
    "nom": "Pied faible",
    "change": "Contrôle et passe avec le pied faible uniquement.",
    "difficulte": "plus difficile"
   },
   {
    "nom": "Un seul ballon",
    "change": "Un seul ballon par groupe, rythme plus lent.",
    "difficulte": "plus facile",
    "materiel": "1 ballon"
   },
   {
    "nom": "Un plot en moins",
    "change": "Passer en triangle : 3 joueurs, 3 plots.",
    "difficulte": "plus facile",
    "materiel": "6 plots"
   }
  ],
  "schema_modele": {
   "v": 3,
   "w": 15,
   "h": 15,
   "items": [
    {
     "t": "plot",
     "x": 72,
     "y": 22
    },
    {
     "t": "plot",
     "x": 228,
     "y": 22
    },
    {
     "t": "plot",
     "x": 228,
     "y": 178
    },
    {
     "t": "plot",
     "x": 72,
     "y": 178
    },
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 72,
     "y": 22
    },
    {
     "t": "p",
     "c": "b",
     "l": "B",
     "x": 228,
     "y": 22
    },
    {
     "t": "p",
     "c": "b",
     "l": "C",
     "x": 228,
     "y": 178
    },
    {
     "t": "p",
     "c": "b",
     "l": "D",
     "x": 72,
     "y": 178
    },
    {
     "t": "ball",
     "x": 81,
     "y": 28,
     "o": 4
    },
    {
     "t": "ball",
     "x": 237,
     "y": 184,
     "o": 6
    }
   ],
   "temps": [
    {
     "moves": {
      "8": {
       "x": 237,
       "y": 28,
       "o": 5
      },
      "9": {
       "x": 81,
       "y": 184,
       "o": 7
      }
     }
    },
    {
     "moves": {
      "8": {
       "x": 237,
       "y": 184,
       "o": 6
      },
      "9": {
       "x": 81,
       "y": 28,
       "o": 4
      }
     }
    },
    {
     "moves": {
      "8": {
       "x": 81,
       "y": 184,
       "o": 7
      },
      "9": {
       "x": 237,
       "y": 28,
       "o": 5
      }
     }
    },
    {
     "moves": {
      "8": {
       "x": 81,
       "y": 28,
       "o": 4
      },
      "9": {
       "x": 237,
       "y": 184,
       "o": 6
      }
     }
    }
   ]
  }
 },
 {
  "id": "tec-002",
  "titre": "Parcours technique",
  "theme": "technique",
  "categories": [
   "U11",
   "U13",
   "U15",
   "U17"
  ],
  "public": [
   "filles",
   "garçons"
  ],
  "niveau": "confirmé",
  "duree_min": 20,
  "joueurs": {
   "min": 5,
   "max": 10
  },
  "surface": "25 x 20 m",
  "materiel": [
   {
    "nom": "ballon",
    "quantite": 2
   },
   {
    "nom": "plot",
    "quantite": 6
   },
   {
    "nom": "mini-but",
    "quantite": 1
   }
  ],
  "objectif": "Enchaîner contrôles orientés, passes et tir.",
  "organisation": "Postes A, B, C, D, E placés comme sur le dessin, un but derrière E. Plusieurs joueurs par poste si besoin.",
  "deroulement": "A passe à B qui contrôle et passe à C, puis D, puis E, qui contrôle et tire. Après sa passe, chaque joueur va au poste suivant. Doubler les postes si nécessaire.",
  "consignes": [
   "Dosage et précision des passes.",
   "Être sur ses appuis."
  ],
  "variantes": [
   {
    "nom": "Les deux pieds",
    "change": "Contrôle et passe avec le pied faible.",
    "difficulte": "plus difficile"
   }
  ],
  "schema_modele": {
   "v": 3,
   "w": 25,
   "h": 20,
   "items": [
    {
     "t": "p",
     "c": "b",
     "l": "A",
     "x": 72,
     "y": 53
    },
    {
     "t": "p",
     "c": "b",
     "l": "B",
     "x": 130,
     "y": 92
    },
    {
     "t": "p",
     "c": "b",
     "l": "C",
     "x": 199,
     "y": 139
    },
    {
     "t": "p",
     "c": "b",
     "l": "D",
     "x": 121,
     "y": 155
    },
    {
     "t": "p",
     "c": "b",
     "l": "E",
     "x": 68,
     "y": 116
    },
    {
     "t": "plot",
     "x": 64,
     "y": 63
    },
    {
     "t": "plot",
     "x": 123,
     "y": 102
    },
    {
     "t": "plot",
     "x": 191,
     "y": 148
    },
    {
     "t": "plot",
     "x": 113,
     "y": 164
    },
    {
     "t": "plot",
     "x": 60,
     "y": 125
    },
    {
     "t": "but",
     "x": 238,
     "y": 92,
     "rot": 90
    },
    {
     "t": "ball",
     "x": 81,
     "y": 59,
     "o": 0
    }
   ],
   "temps": [
    {
     "moves": {
      "11": {
       "x": 139,
       "y": 98,
       "o": 1
      }
     }
    },
    {
     "moves": {
      "11": {
       "x": 208,
       "y": 145,
       "o": 2
      },
      "0": {
       "x": 130,
       "y": 92
      }
     }
    },
    {
     "moves": {
      "11": {
       "x": 130,
       "y": 161,
       "o": 3
      },
      "1": {
       "x": 199,
       "y": 139
      }
     }
    },
    {
     "moves": {
      "11": {
       "x": 77,
       "y": 122,
       "o": 4
      },
      "2": {
       "x": 121,
       "y": 155
      }
     }
    },
    {
     "moves": {
      "11": {
       "x": 238,
       "y": 92,
       "o": null
      },
      "3": {
       "x": 68,
       "y": 116
      }
     }
    },
    {
     "moves": {
      "4": {
       "x": 72,
       "y": 53
      }
     }
    }
   ]
  }
 },
 {
  "id": "tec-003",
  "titre": "Contrôle orienté en zigzag",
  "theme": "technique",
  "categories": [
   "U9",
   "U11",
   "U13",
   "U15"
  ],
  "public": [
   "filles",
   "garçons"
  ],
  "niveau": "débutant",
  "duree_min": 15,
  "joueurs": {
   "min": 6,
   "max": 12
  },
  "surface": "20 x 10 m",
  "materiel": [
   {
    "nom": "ballon",
    "quantite": 2
   },
   {
    "nom": "plot",
    "quantite": 8
   },
   {
    "nom": "chasuble (2 couleurs)",
    "quantite": 6
   }
  ],
  "objectif": "Contrôler en changeant d'orientation, puis passer.",
  "organisation": "2 groupes (rouge et jaune), joueurs placés en zigzag face à face, chacun près de son plot.",
  "deroulement": "A passe à D, qui contrôle en s'orientant vers E et lui passe, puis E vers F, et ainsi de suite. Quand tous ont passé, on revient dans l'autre sens.",
  "consignes": [
   "Après la passe, rester sur place sur ses appuis.",
   "Contrôle orienté demandé par l'éducateur."
  ],
  "variantes": [
   {
    "nom": "Un ballon de plus",
    "change": "Deux ballons dans le jeu.",
    "difficulte": "plus difficile"
   }
  ],
  "schema_modele": {
   "v": 3,
   "w": 20,
   "h": 10,
   "items": [
    {
     "t": "plot",
     "x": 30,
     "y": 146
    },
    {
     "t": "p",
     "c": "j",
     "l": "A",
     "x": 46,
     "y": 146
    },
    {
     "t": "plot",
     "x": 101,
     "y": 54
    },
    {
     "t": "p",
     "c": "r",
     "l": "D",
     "x": 116,
     "y": 54
    },
    {
     "t": "plot",
     "x": 168,
     "y": 146
    },
    {
     "t": "p",
     "c": "j",
     "l": "E",
     "x": 184,
     "y": 146
    },
    {
     "t": "plot",
     "x": 238,
     "y": 54
    },
    {
     "t": "p",
     "c": "r",
     "l": "F",
     "x": 254,
     "y": 54
    },
    {
     "t": "ball",
     "x": 55,
     "y": 152,
     "o": 1
    }
   ],
   "temps": [
    {
     "moves": {
      "8": {
       "x": 125,
       "y": 60,
       "o": 3
      }
     }
    },
    {
     "moves": {
      "8": {
       "x": 193,
       "y": 152,
       "o": 5
      }
     }
    },
    {
     "moves": {
      "8": {
       "x": 263,
       "y": 60,
       "o": 7
      }
     }
    },
    {
     "moves": {
      "8": {
       "x": 193,
       "y": 152,
       "o": 5
      }
     }
    },
    {
     "moves": {
      "8": {
       "x": 125,
       "y": 60,
       "o": 3
      }
     }
    },
    {
     "moves": {
      "8": {
       "x": 55,
       "y": 152,
       "o": 1
      }
     }
    }
   ]
  }
 }
];
