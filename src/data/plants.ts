export type Plant = {
  id: string;
  name: string;
  japanese?: string;
  romaji?: string;
  scientific?: string;
  description: string;
  manyoshu?: string[];
  links?: { label: string; url: string }[];
  /** position on the map as percentages (0-100) */
  x: number;
  y: number;
};

export const plants: Plant[] = [
  {
    id: "black-pine",
    name: "Japanese Black Pine",
    japanese: "黒松",
    romaji: "Kuromatsu",
    scientific: "Pinus thunbergii",
    description:
      "One of the most iconic elements of Japanese gardens. Often trimmed in a bonsai form, these trees are seen as a direct link between the heavens and earth. The needles or 'candles' are trimmed to point upward toward the gods.",
    manyoshu: [
      "MYS I: 11", "MYS I: 34", "MYS I: 63", "MYS II: 141", "MYS II: 143",
      "MYS III: 257", "MYS V: 895", "MYS VIII: 1458", "MYS X: 1937",
      "MYS XV: 3621", "MYS XIX: 4169", "MYS XX: 4501",
      "(and 70+ more — pine is the most-referenced plant in the Man'yōshū)",
    ],
    links: [{ label: "Pine poems on wakapoetry.net", url: "http://www.wakapoetry.net/matsu/" }],
    x: 38, y: 42,
  },
  {
    id: "flowering-cherry",
    name: "Flowering Cherry",
    japanese: "山桜",
    romaji: "Sakura / Yamazakura",
    scientific: "Prunus serrulata 'Kwanzan'",
    description:
      "A prominent symbol in Japan, often seen on kimono and confectionery. The cherry symbolizes impermanence — its dormancy is seen as just as beautiful as its blossoms. The wood makes a gray-colored charcoal and the leaves are used to wrap mochi.",
    manyoshu: ["MYS VIII: 1440", "MYS X: 1869"],
    links: [{ label: "MYS X: 1869", url: "http://www.wakapoetry.net/mys-x-1869/" }],
    x: 55, y: 35,
  },
  {
    id: "wisteria",
    name: "Wisteria",
    japanese: "藤",
    romaji: "Fuji / Nodafuji / Yamafuji",
    scientific: "Wisteria floribunda",
    description:
      "Traditionally used in combination with mulberry trees to make high-quality paper. The fragrant root is used in baths.",
    manyoshu: [
      "MYS III: 330", "MYS III: 413", "MYS VIII: 1471", "MYS X: 1901",
      "MYS XIX: 4188", "MYS XIX: 4199", "MYS XIX: 4210", "(26 references total)",
    ],
    links: [
      { label: "MYS XIX: 4188", url: "http://www.wakapoetry.net/mys-xix-4188/" },
      { label: "MYS XIX: 4199", url: "http://www.wakapoetry.net/mys-xix-4199/" },
    ],
    x: 70, y: 25,
  },
  {
    id: "azalea",
    name: "Azalea",
    japanese: "山躑躅",
    romaji: "Yamatsutsuji",
    scientific: "Azalea",
    description:
      "Long used as a festival flower. Modern azaleas would not be in such wide production were it not for the work of Japanese gardeners and cultivators.",
    manyoshu: [
      "MYS II: 185", "MYS III: 434", "MYS III: 443", "MYS VI: 971",
      "MYS VII: 1188", "MYS IX: 1694", "MYS X: 1905", "MYS XIII: 3305", "MYS XIII: 3309",
    ],
    links: [{ label: "MYS II: 185", url: "http://www.wakapoetry.net/mys-ii-185/" }],
    x: 48, y: 60,
  },
  {
    id: "japanese-camellia",
    name: "Japanese Camellia",
    japanese: "藪椿 / 山椿",
    romaji: "Yabutsubaki / Yamatsubaki",
    scientific: "Camellia japonica",
    description:
      "Oil pressed from the seeds (tsubaki-abura, 椿油) has been traditionally used in Japan for hair care, and the plant is used to prepare anti-inflammatory medicines. Camellias offer splashes of color and impermanence in the landscape.",
    x: 62, y: 55,
  },
  {
    id: "sasanqua-camellia",
    name: "Sasanqua Camellia",
    scientific: "Camellia sasanqua",
    description: "A close relative of the Japanese camellia, blooming in autumn and early winter.",
    manyoshu: [
      "MYS I: 54", "MYS I: 56", "MYS I: 73", "MYS VII: 1262",
      "MYS XIII: 3222", "MYS XIX: 4152", "MYS XX: 4418", "MYS XX: 4481",
    ],
    links: [{ label: "MYS I: 54", url: "http://www.wakapoetry.net/mys-i-54/" }],
    x: 75, y: 50,
  },
  {
    id: "japanese-magnolia",
    name: "Japanese Magnolia",
    romaji: "Honoki",
    scientific: "Magnolia liliiflora",
    description:
      "Bark extract has been used for ~1,000 years in traditional Chinese and Japanese medicine for ailments ranging from asthma to depression to muscle pain.",
    manyoshu: ["MYS XIX: 4204"],
    x: 30, y: 30,
  },
  {
    id: "japanese-maple",
    name: "Japanese Maple",
    romaji: "Kaerude / Irohakaerude / Kaede / Yamamomiji",
    scientific: "Acer palmatum",
    description:
      "The leaves are packed around apples and root crops to help preserve them. The wood is used to make instruments and flooring; the leaves are also used in bouquets.",
    manyoshu: ["MYS VIII: 1623", "MYS XIV: 3494"],
    x: 45, y: 48,
  },
  {
    id: "madake-bamboo",
    name: "Madake Bamboo",
    romaji: "Take",
    scientific: "Phyllostachys bambusoides",
    description:
      "A large bamboo that sprouts March–April, when its shoots are edible. The leaves are used to wrap rice balls; the wood is used for building and crafting. In the JACCC garden, the bamboo forest represents the future of the Japanese American community — its strength and flexibility.",
    x: 82, y: 40,
  },
  {
    id: "golden-bamboo",
    name: "Golden Bamboo",
    scientific: "Phyllostachys aurea",
    description: "An ornamental bamboo cluster forming an evergreen screen.",
    manyoshu: [
      "MYS II: 167", "MYS II: 199", "MYS III: 379", "MYS V: 824",
      "MYS VI: 955", "MYS VII: 1412", "MYS X: 1790", "MYS XIX: 4286", "(20 references total)",
    ],
    x: 88, y: 55,
  },
  {
    id: "broad-leaf-bamboo",
    name: "Broad Leaf Bamboo",
    romaji: "Sasa",
    description: "A short, broad-leafed bamboo used widely as understory and groundcover.",
    x: 78, y: 65,
  },
  {
    id: "camphor",
    name: "Camphor",
    romaji: "Kusunoki",
    scientific: "Cinnamomum camphora",
    description: "The oil of camphor trees is commonly used in industrial applications.",
    x: 22, y: 50,
  },
  {
    id: "crape-myrtle",
    name: "Crape Myrtle",
    romaji: "Saru Suberi (slippery)",
    scientific: "Lagerstroemia",
    description:
      "Known in Japan as Saru Suberi — 'slippery' — from old folklore that the bark is so smooth not even a monkey can climb it.",
    x: 60, y: 70,
  },
  {
    id: "fortnight-lily",
    name: "Fortnight Lily",
    japanese: "笹百合 / 山百合",
    romaji: "Sasayuri / Yamayuri (substituted)",
    scientific: "Dietes iridioides",
    description:
      "Substituted for the lilies of the Man'yōshū to suit the Southern California climate. Traditionally, Japanese lily (Lilium japonicum) and mountain lily (Lilium auratum) would be used.",
    manyoshu: [
      "MYS VII: 1257", "MYS VIII: 1503", "MYS XI: 2467",
      "MYS XVIII: 4086", "MYS XVIII: 4087", "MYS XVIII: 4088",
      "MYS XVIII: 4113", "MYS XVIII: 4115", "MYS XX: 4369",
    ],
    x: 35, y: 72,
  },
  {
    id: "dwarf-mondo",
    name: "Dwarf Mondo Grass",
    romaji: "Janohige / Ryunohige / Yaburan",
    scientific: "Ophiopogon japonicus",
    description:
      "Used in traditional Japanese gardens as a groundcover, especially in geometric settings.",
    manyoshu: [
      "MYS IV: 546", "MYS XI: 2456", "MYS XI: 2474", "MYS XI: 2477",
      "MYS XII: 2862", "MYS XII: 3051", "MYS XIII: 3291", "MYS XX: 4484",
    ],
    x: 42, y: 80,
  },
  {
    id: "evergreen-pear",
    name: "Evergreen Pear",
    romaji: "Nashi",
    scientific: "Pyrus kawakamii",
    description: "A substitute for the edible pears commonly found in Japanese gardens. Nashi is the general word for pear.",
    manyoshu: ["MYS X: 2188", "MYS X: 2189", "MYS XVI: 3834", "MYS XIX: 4259"],
    x: 18, y: 38,
  },
  {
    id: "miniature-juniper",
    name: "Miniature Japanese Juniper",
    romaji: "Nezu",
    scientific: "Juniperus procumbens 'Nana'",
    description:
      "Though not the same juniper found in the Man'yōshū, this dwarf form is widely used as a groundcover in Japanese gardens.",
    manyoshu: ["MYS III: 446"],
    x: 52, y: 75,
  },
  {
    id: "japanese-holly",
    name: "Japanese Holly",
    scientific: "Ilex crenata",
    description:
      "A native plant to Japan. People put a sardine's head with hollies at the entrance of their homes — evils hate the smell of sardines and the jagged leaves of holly. The plant signifies 'defense.'",
    x: 68, y: 78,
  },
  {
    id: "japanese-pittosporum",
    name: "Japanese Pittosporum",
    scientific: "Pittosporum tobira",
    description: "A native plant to Japan, commonly used in ornamental applications.",
    x: 28, y: 60,
  },
  {
    id: "japanese-elm",
    name: "Japanese Elm",
    scientific: "Ulmus davidiana var. japonica",
    description: "A native plant to Japan's forests.",
    x: 12, y: 55,
  },
  {
    id: "donated-persimmon",
    name: "Donated Persimmon",
    description:
      "Donated from Hiroshima — a survivor of the atomic bomb dropped on August 6, 1945. Planted at the JACCC in 2013. Persimmon leaves are traditionally used to wrap food.",
    x: 25, y: 75,
  },
  {
    id: "baran",
    name: "Baran",
    scientific: "Aspidistra elatior",
    description:
      "A broad-leaf plant used in culinary settings — often seen in table settings and used to wrap food.",
    x: 15, y: 70,
  },
  {
    id: "leather-fern",
    name: "Leather Fern",
    scientific: "Rumohra adiantiformis",
    description:
      "Not native to Japan — substituted to suit the Southern California climate. In Japan, ferns are used to help keep food longer.",
    x: 72, y: 70,
  },
];
