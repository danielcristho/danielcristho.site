export type Constellation = {
  /* what the graph itself is labelled with, one name only */
  short: string;
  names: {
    english: string;
    maori?: string;
    hawaiian?: string;
    byak?: string;
  };
  note: string;
  sources: { label: string; url: string }[];
  stars: [number, number][];
  lines: [number, number][];
};

export const constellations: Constellation[] = [
  {
    short: "Bagar",
    names: {
      english: "Pleiades (the Seven Sisters)",
      maori: "Matariki",
      hawaiian: "Makaliʻi",
      byak: "Bagar, Insandi, Waibaki or Makdwer",
    },
    note: "Nine stars in Rangi Mātāmua's reading of the Te Kōkau manuscript, seven in many other accounts. Its dawn rising opens the Māori new year.",
    sources: [
      {
        label: "AUT, the nine whetū of Matariki",
        url: "https://aut.ac.nz/about/maori/matariki/the-9-whetu-stars-of-matariki",
      },
      {
        label: "Byak names, Wolne Media",
        url: "https://wolnemedia.net/astronomiczna-wiedza-zeglarskiego-ludu-biak/",
      },
    ],
    stars: [
      [0.1, 0.3],
      [0.26, 0.18],
      [0.4, 0.34],
      [0.55, 0.22],
      [0.68, 0.4],
      [0.33, 0.52],
      [0.5, 0.6],
      [0.8, 0.26],
      [0.2, 0.62],
    ],
    lines: [
      [0, 1],
      [1, 3],
      [3, 7],
      [1, 2],
      [2, 4],
      [5, 6],
      [0, 5],
      [5, 8],
    ],
  },
  {
    short: "Sawakoi",
    names: {
      english: "Orion's Belt",
      maori: "Tautoru",
      hawaiian: "Nā Kao, the darts",
      byak: "Sawakoi, the whole figure of Orion",
    },
    note: "Tautoru means the string of three. Nā Kao covers the belt and the sword; the whole figure of Orion is Ka Heihei o Nā Keiki, the children's string game. Byak sailors of Sowek read Sawakoi, Orion, together with Romanggwandi to tell the turn of the seasons.",
    sources: [
      {
        label: "Hōkūleʻa, Hawaiian star lines",
        url: "https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/polynesian-non-instrument-wayfinding/hawaiian-star-lines/",
      },
      {
        label: "Byak names, Rumbekwan & Yabdi 2018",
        url: "https://lppm.uncen.ac.id/wp-content/uploads/2022/04/4.-FKIP-ALBERT-OK.pdf",
      },
    ],
    stars: [
      [0, 0],
      [0.5, 0.1],
      [1, 0.2],
    ],
    lines: [
      [0, 1],
      [1, 2],
    ],
  },
  {
    short: "Romanggwandi",
    names: {
      english: "Scorpius, the curved tail",
      maori: "Te Matau a Māui",
      hawaiian: "Ka Makau Nui o Māui",
      byak: "Romanggwandi",
    },
    note: "The fish hook Māui used to haul up land. Hua, which is Antares, is the knot tying the line to the hook. Byak sailors call it Romanggwandi, the sky dragon, and split the twelve months across the parts of its body.",
    sources: [
      {
        label: "Hōkūleʻa, Hawaiian star lines",
        url: "https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/polynesian-non-instrument-wayfinding/hawaiian-star-lines/",
      },
      {
        label: "Byak names, Rumbekwan & Yabdi 2018",
        url: "https://lppm.uncen.ac.id/wp-content/uploads/2022/04/4.-FKIP-ALBERT-OK.pdf",
      },
    ],
    stars: [
      [0.08, 0.02],
      [0.02, 0.22],
      [0.06, 0.42],
      [0.2, 0.58],
      [0.4, 0.66],
      [0.58, 0.6],
      [0.64, 0.44],
      [0.52, 0.33],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
    ],
  },
  {
    short: "Sraiknam",
    names: {
      english: "Ursa Major",
      hawaiian: "Hikukahi to Hikupau, Dubhe through Alkaid",
      byak: "Sraiknam",
      maori: "",
    },
    note: "Byak navigators read these seven stars as a coconut palm. A spoon in China, Japan and Korea, a plough or a bear elsewhere. Sources differ: Wolne Media keeps Sraiknam for Ursa Major and Maksrai for Lyra, while the Pustaka Papua piece uses both names for the palm.",
    sources: [
      {
        label: "Pustaka Papua, Byak astronomy",
        url: "http://www.pustakapapua.com/",
      },
      {
        label: "Wolne Media, Byak star names",
        url: "https://wolnemedia.net/astronomiczna-wiedza-zeglarskiego-ludu-biak/",
      },
    ],
    stars: [
      [0.0, 0.1],
      [0.06, 0.38],
      [0.3, 0.42],
      [0.28, 0.2],
      [0.5, 0.14],
      [0.72, 0.08],
      [0.95, 0.0],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    short: "Te Punga",
    names: {
      english: "The Southern Cross (Crux)",
      maori: "Te Punga, the anchor, also Māhutonga",
      hawaiian: "Hānaiakamalama",
      byak: "",
    },
    note: "Its long axis points at the celestial south pole, which is what makes it steer. Te Ara counts at least eight Māori names for it: Te Punga, the anchor of a sky canoe in Tainui accounts, and Māhutonga, a gap in the Milky Way in Wairarapa accounts. The Hawaiian name rests on a secondary source.",
    sources: [
      {
        label: "Te Ara, Southern Cross",
        url: "https://teara.govt.nz/en/southern-cross",
      },
      {
        label: "Pasefika, Pacific names for Crux",
        url: "https://pasefika.com/Art/painting/127/apisapaSumu/pa/Sumu%20-oil%20-painting",
      },
    ],
    stars: [
      [0.45, 0.0],
      [0.5, 1.0],
      [0.0, 0.55],
      [0.85, 0.42],
    ],
    lines: [
      [0, 1],
      [2, 3],
    ],
  },
];

/* The TIL graph is drawn on a 600×300 canvas, 
so these are the pixel coordinates of the constellation slots. */
export const slots: [number, number, number][] = [
  [58, 28, 112],
  [596, 44, 132],
  [556, 196, 148],
  [52, 206, 140],
  [300, 18, 120],
  [300, 252, 120],
];
