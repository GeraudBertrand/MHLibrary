// ═══════════ Constantes globales ═══════════
window.Constants = {

  // ── Icônes monstres (par ID API) ──
  MONSTER_ICONS: {
    1: 'Zoh_Shia', 2: 'Guardian_Doshaguma', 3: 'Rey_Dau', 4: 'Lala_Barina',
    5: 'Congalala', 6: 'Nerscylla', 7: 'Gore_Magala', 8: 'Gravios',
    9: 'Guardian_Arkveld', 10: 'Quematrice', 11: 'Doshaguma', 12: 'Balahara',
    13: 'Rathian', 14: 'Chatacabra', 15: 'Mizutsune', 16: 'Guardian_Fulgur_Anjanath',
    17: 'Hirabami', 18: 'Yian_Kut-Ku', 19: 'Rompopolo', 20: 'Arkveld',
    21: 'Ajarakan', 22: 'Gypceros', 23: 'Xu_Wu', 24: 'Guardian_Rathalos',
    25: 'Uth_Duna', 26: 'Jin_Dahaad', 27: 'Nu_Udra', 28: 'Guardian_Ebony_Odogaron',
    29: 'Rathalos', 30: 'Blangonga', 31: 'Lagiacrus', 32: 'Seregios',
    33: 'Omega_Planetes', 34: 'Gogmazios'
  },

  // ── Icônes lieux (par ID API) ──
  LOCATION_ICONS: {
    1: 'Oilwell-Basin',
    2: 'Windward-Plains',
    3: 'Scarlet-Forest',
    4: 'Ruins-of-Wyveria',
    5: 'Iceshard-Cliffs',
    6: 'Wounded-Hollow'
  },

  // ── Mapping pièces d'armure → fichier icône ──
  ARMOR_PIECE_MAP: {
    head: 'helm', chest: 'chest', arms: 'arms', waist: 'torso', legs: 'legs'
  },

  // ── Labels éléments / résistances ──
  ELEMENT_LABELS: {
    fire: 'Feu', water: 'Eau', ice: 'Glace', thunder: 'Foudre', dragon: 'Dragon'
  },

  // ── Labels faiblesses (éléments + statuts + effets) ──
  WEAKNESS_LABELS: {
    fire: 'Feu', water: 'Eau', ice: 'Glace', thunder: 'Foudre', dragon: 'Dragon',
    poison: 'Poison', paralysis: 'Paralysie', sleep: 'Sommeil',
    blastblight: 'Explosion', stun: 'Étourdissement',
    blast: 'Explosion', exhaust: 'Épuisement', flash: 'Flash', noise: 'Son',
    pitfall: 'Piège fosse', shock: 'Piège choc'
  },

  // ── Labels zones de récolte (rewards) ──
  REWARD_KIND_LABELS: {
    'target-reward': 'Récompense de cible',
    'carve': 'Dépeçage',
    'carve-severed': 'Dépeçage (coupé)',
    'carve-rotten': 'Dépeçage (pourri)',
    'broken-part': 'Partie brisée',
    'wound-destroyed': 'Blessure détruite',
    'tempered-wound-destroyed': 'Blessure trempée détruite',
    'dropped': 'Objet lâché',
    'palico': 'Palico'
  },

  // ── Labels parties du monstre ──
  PART_LABELS: {
    'left-wing': 'Aile gauche', 'right-wing': 'Aile droite',
    'head': 'Tête', 'tail': 'Queue', 'back': 'Dos',
    'body': 'Corps', 'legs': 'Pattes', 'horns': 'Cornes'
  },

  // ── Types d'armes (14 kinds MH Wilds) ──
  WEAPON_KINDS: [
    { id: 'great-sword',    label: 'Grande épée' },
    { id: 'long-sword',     label: 'Épée longue' },
    { id: 'sword-shield',   label: 'Épée & bouclier' },
    { id: 'dual-blades',    label: 'Lames doubles' },
    { id: 'hammer',         label: 'Marteau' },
    { id: 'hunting-horn',   label: 'Corne de chasse' },
    { id: 'lance',          label: 'Lance' },
    { id: 'gunlance',       label: 'Lancecanon' },
    { id: 'switch-axe',     label: 'Morpho-hache' },
    { id: 'charge-blade',   label: 'Volto-hache' },
    { id: 'insect-glaive',  label: 'Bâton insecte' },
    { id: 'light-bowgun',   label: 'Fusarbalète léger' },
    { id: 'heavy-bowgun',   label: 'Fusarbalète lourd' },
    { id: 'bow',            label: 'Arc' }
  ],

  // ── Types de munitions ──
  AMMO_LABELS: {
    normal: 'Normal', pierce: 'Perçante', spread: 'Grenaille',
    sticky: 'Collante', thunder: 'Foudre', poison: 'Poison',
    demon: 'Démon', recover: 'Soin', tranq: 'Tranquillisante',
    fire: 'Feu', water: 'Eau', ice: 'Glace', dragon: 'Dragon',
    exhaust: 'Épuisement', sleep: 'Sommeil', paralysis: 'Paralysie',
    slicing: 'Tranchante', cluster: 'Grappe', wyvern: 'Wyverne'
  },

  // ── Couleurs des munitions ──
  AMMO_COLORS: {
    normal: '#b8a070', pierce: '#3080d0', spread: '#e08030',
    sticky: '#e0c020', thunder: '#e0c020', poison: '#9060c0',
    demon: '#c03030', recover: '#60b030', tranq: '#70a0d0',
    fire: '#e05030', water: '#3080d0', ice: '#60c0e0', dragon: '#8040c0',
    exhaust: '#80a060', sleep: '#70a0d0', paralysis: '#d0b030',
    slicing: '#d07030', cluster: '#c03030', wyvern: '#b83030'
  },

  // ── Labels revêtements arc ──
  COATING_LABELS: {
    power: 'Puissance', poison: 'Poison', paralysis: 'Paralysie',
    sleep: 'Sommeil', blast: 'Explosion', close: 'Courte portée',
    exhaust: 'Épuisement'
  },

  // ── Labels type d'obus (gunlance) ──
  SHELL_LABELS: {
    normal: 'Normal', wide: 'Large', long: 'Long'
  },

  // ── Labels spéciaux armes ──
  SPECIAL_LABELS: {
    element: 'Élément', status: 'Statut'
  },

  // ── Sous-onglets équipements ──
  EQUIPMENT_TABS: [
    { id: 'armor',       label: 'Armures' },
    { id: 'charms',      label: 'Talismans' },
    { id: 'decorations', label: 'Joyaux' }
  ],

  // ── Risque des campements ──
  CAMP_RISK_LABELS: {
    'safe': 'Sûr',
    'insecure': 'Risqué',
    'dangerous': 'Dangereux'
  },

  CAMP_RISK_COLORS: {
    'safe': '#4a9e4a',
    'insecure': '#c4952a',
    'dangerous': '#b83030'
  },

  // ── Cartes des lieux (par ID API) — niveaux/étages ──
  // Chaque entrée : tableau d'objets { img, zones? } (index = floor/niveau)
  // zones = fichier SVG Illustrator avec les polygones de zones (optionnel)
  LOCATION_MAPS: {
    1: [                                                // Oilwell Basin
      { img: 'ob1.jpg', zones: 'ob1-zones.svg' },
      { img: 'ob2.jpg', zones: 'ob2-zones.svg' },
      { img: 'ob3.jpg', zones: 'ob3-zones.svg' }
    ],
    2: [                                                // Windward Plains
      { img: 'wp1.jpg', zones: 'wp1-zones.svg' },
      { img: 'wp2.jpg', zones: 'wp2-zones.svg' }
    ],
    3: [                                                // Scarlet Forest
      { img: 'sf1.jpg', zones: 'sf1-zones.svg' },
      { img: 'sf2.jpg', zones: 'sf2-zones.svg' }
    ],
    4: [                                                // Ruins of Wyveria
      { img: 'rw1.jpg', zones: 'rw1-zones.svg' },
      { img: 'rw2.jpg', zones: 'rw2-zones.svg' },
      { img: 'rw3.jpg', zones: 'rw3-zones.svg' },
      { img: 'rw4.jpg', zones: 'rw4-zones.svg' }
    ],
    5: [                                                // Iceshard Cliffs
      { img: 'ic1.jpg', zones: 'ic1-zones.svg' },
      { img: 'ic2.jpg', zones: 'ic2-zones.svg' },
      { img: 'ic3.jpg', zones: 'ic3-zones.svg' }
    ]
    // 6: Wounded Hollow — pas de carte disponible
  },

  // ── Labels niveaux de carte ──
  MAP_FLOOR_LABELS: ['Niveau 1', 'Niveau 2', 'Niveau 3', 'Niveau 4']
}
