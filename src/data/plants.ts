export type Plant = {
  id: string;
  name: string;
  japanese?: string;
  romaji?: string;
  scientific?: string;
  description: string;
  /** Raw refs like "MYS X: 1869" — auto-linked to wakapoetry.net */
  manyoshu?: string[];
  /** General-category fallback poems used when no species-specific
   *  Man'yōshū poem exists for this plant (e.g. leather fern → fern). */
  categoryRefs?: { label: string; refs: string[] };
  /** True when the species was substituted for the original Man'yōshū plant
   *  to suit the Los Angeles / Southern California climate. */
  substitute?: boolean;
  /** Extra curated links (collections, etc.) */
  links?: { label: string; url: string }[];
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
      "MYS I: 11", "MYS I: 34", "MYS I: 63", "MYS I: 65", "MYS I: 66", "MYS I: 73",
      "MYS II: 113", "MYS II: 141", "MYS II: 143", "MYS II: 144", "MYS II: 145", "MYS II: 146", "MYS II: 228",
      "MYS III: 257", "MYS III: 260", "MYS III: 279", "MYS III: 295", "MYS III: 309", "MYS III: 394", "MYS III: 431", "MYS III: 444",
      "MYS IV: 588", "MYS IV: 593", "MYS IV: 623",
      "MYS V: 895",
      "MYS VI: 952", "MYS VI: 990", "MYS VI: 1030", "MYS VI: 1041", "MYS VI: 1042", "MYS VI: 1043",
      "MYS VII: 1159", "MYS VII: 1185",
      "MYS VIII: 1458", "MYS VIII: 1650", "MYS VIII: 1654",
      "MYS IX: 1674", "MYS IX: 1687", "MYS IX: 1716", "MYS IX: 1783", "MYS IX: 1795",
      "MYS X: 1922", "MYS X: 1937", "MYS X: 2198", "MYS X: 2313", "MYS X: 2314",
      "MYS XI: 2484", "MYS XI: 2485", "MYS XI: 2486", "MYS XI: 2487", "MYS XI: 2653", "MYS XI: 2751",
      "MYS XII: 2861", "MYS XII: 3047", "MYS XII: 3130",
      "MYS XIII: 3258", "MYS XIII: 3324", "MYS XIII: 3346",
      "MYS XIV: 3433", "MYS XIV: 3495",
      "MYS XV: 3621", "MYS XV: 3655", "MYS XV: 3721", "MYS XV: 3747",
      "MYS XVII: 3890", "MYS XVII: 3899", "MYS XVII: 3942", "MYS XVII: 4014",
      "MYS XIX: 4169", "MYS XIX: 4177", "MYS XIX: 4266", "MYS XIX: 4271",
      "MYS XX: 4375", "MYS XX: 4439", "MYS XX: 4457", "MYS XX: 4464", "MYS XX: 4498", "MYS XX: 4501",
    ],
    links: [{ label: "All pine (matsu) poems", url: "http://www.wakapoetry.net/matsu/" }],
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
      "MYS III: 330", "MYS III: 413",
      "MYS VIII: 1471", "MYS VIII: 1627",
      "MYS X: 1901", "MYS X: 1944", "MYS X: 1974", "MYS X: 1991",
      "MYS XII: 2971", "MYS XII: 3075",
      "MYS XIII: 3248",
      "MYS XIV: 3504",
      "MYS XVII: 3952", "MYS XVII: 3993",
      "MYS XVIII: 4042", "MYS XVIII: 4043",
      "MYS XIX: 4178", "MYS XIX: 4188", "MYS XIX: 4192", "MYS XIX: 4193",
      "MYS XIX: 4199", "MYS XIX: 4200", "MYS XIX: 4201", "MYS XIX: 4202",
      "MYS XIX: 4207", "MYS XIX: 4210",
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
    categoryRefs: {
      label: "Camellia (tsubaki, 椿)",
      refs: [
        "MYS I: 54", "MYS I: 56", "MYS I: 73",
        "MYS VII: 1262", "MYS XIII: 3222",
        "MYS XIX: 4152", "MYS XIX: 4177",
        "MYS XX: 4418", "MYS XX: 4481",
      ],
    },
    links: [{ label: "All camellia (tsubaki) poems", url: "http://www.wakapoetry.net/tag/tsubaki/" }],
    x: 62, y: 55,
  },
  {
    id: "sasanqua-camellia",
    name: "Sasanqua Camellia",
    scientific: "Camellia sasanqua",
    description: "A close relative of the Japanese camellia, blooming in autumn and early winter.",
    manyoshu: [
      "MYS I: 54", "MYS I: 56", "MYS I: 73",
      "MYS VII: 1262", "MYS XIII: 3222",
      "MYS XIX: 4152", "MYS XIX: 4177",
      "MYS XX: 4418", "MYS XX: 4481",
    ],
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
    categoryRefs: {
      label: "Bamboo (take, 竹)",
      refs: [
        "MYS III: 379", "MYS III: 420",
        "MYS VI: 955", "MYS VI: 1047",
        "MYS VII: 1412", "MYS XIX: 4291",
      ],
    },
    links: [{ label: "All bamboo (take) poems", url: "http://www.wakapoetry.net/tag/take/" }],
    x: 82, y: 40,
  },
  {
    id: "golden-bamboo",
    name: "Golden Bamboo",
    scientific: "Phyllostachys aurea",
    description: "An ornamental bamboo cluster forming an evergreen screen.",
    manyoshu: [
      "MYS II: 167", "MYS II: 199", "MYS II: 217",
      "MYS III: 379", "MYS III: 420",
      "MYS V: 824",
      "MYS VI: 955", "MYS VI: 1047", "MYS VI: 1050",
      "MYS VII: 1412",
      "MYS IX: 1677",
      "MYS X: 1790",
      "MYS XI: 2530", "MYS XI: 2773",
      "MYS XIII: 3284",
      "MYS XIV: 3474",
      "MYS XV: 3758",
      "MYS XVI: 3791",
      "MYS XIX: 4286", "MYS XIX: 4291",
    ],
    x: 88, y: 55,
  },
  {
    id: "broad-leaf-bamboo",
    name: "Broad Leaf Bamboo",
    romaji: "Sasa",
    description: "A short, broad-leafed bamboo used widely as understory and groundcover.",
    categoryRefs: {
      label: "Sasa / bamboo grass (笹)",
      refs: [
        "MYS II: 133", "MYS VII: 1121", "MYS XX: 4431",
      ],
    },
    links: [{ label: "All sasa poems", url: "http://www.wakapoetry.net/tag/sasa/" }],
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
    substitute: true,
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
      "MYS IV: 546",
      "MYS XI: 2456", "MYS XI: 2474", "MYS XI: 2477",
      "MYS XII: 2862", "MYS XII: 3051", "MYS XII: 3053", "MYS XII: 3055", "MYS XII: 3066", "MYS XII: 3204",
      "MYS XIII: 3291",
      "MYS XIV: 3577",
      "MYS XX: 4484",
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
    substitute: true,
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
    substitute: true,
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
    categoryRefs: {
      label: "Tsuki / hemlock-elm (槻)",
      refs: ["MYS III: 324"],
    },
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
    categoryRefs: {
      label: "Fern (sawarabi 早蕨 / shida 羊歯)",
      refs: ["MYS VIII: 1418", "MYS X: 1872"],
    },
    links: [{ label: "All warabi (fern) poems", url: "http://www.wakapoetry.net/tag/warabi/" }],
    x: 72, y: 70,
  },
];

/** "MYS X: 1869" → "http://www.wakapoetry.net/mys-x-1869/" */
export function manyoshuUrl(ref: string): string | null {
  const m = ref.match(/MYS\s+([IVX]+)\s*:\s*(\d+)/i);
  if (!m) return null;
  return `http://www.wakapoetry.net/mys-${m[1].toLowerCase()}-${m[2]}/`;
}
