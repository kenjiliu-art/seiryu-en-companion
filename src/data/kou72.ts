// Japan's 72 microseasons (七十二候 / shichijūni-kō), Kyoto canonical dates.
// Each kō spans ~5 days; the cycle starts at Risshun (~Feb 4).
//
// `laNote` translates the kō for the Los Angeles Mediterranean climate when
// the literal Kyoto reading doesn't apply (no tsuyu, no hard frost, drier
// summers, etc.). Empty laNote = the Kyoto reading reads cleanly in LA.
//
// `plantIds` links to garden plant ids whose phenology embodies that kō,
// so the UI can highlight them when the user taps a microseason.

export type Kou = {
  /** 1..72, starting from Risshun */
  index: number;
  /** Approximate start date in Kyoto (month 1-12, day 1-31) */
  start: { m: number; d: number };
  kanji: string;
  romaji: string;
  /** Plain-English gloss of the Kyoto meaning */
  en: string;
  /** LA-shifted reading when meaningfully different from Kyoto */
  laNote?: string;
  /** Garden plant ids that embody this kō in LA */
  plantIds?: string[];
};

export const kou72: Kou[] = [
  // 立春 Risshun
  { index: 1,  start: { m: 2,  d: 4  }, kanji: "東風解凍",   romaji: "Harukaze kōri o toku",     en: "East wind melts the ice",                       laNote: "No ice in LA — read as the first warm Santa Ana lulls." },
  { index: 2,  start: { m: 2,  d: 9  }, kanji: "黄鶯睍睆",   romaji: "Kōō kenkan su",            en: "Bush warbler starts singing",                  laNote: "Hermit thrush and mockingbird take the role here.", plantIds: ["evergreen-pear"] },
  { index: 3,  start: { m: 2,  d: 14 }, kanji: "魚上氷",     romaji: "Uo kōri o izuru",          en: "Fish emerge from the ice",                      laNote: "Koi in JACCC's pond grow visibly more active." },
  // 雨水 Usui
  { index: 4,  start: { m: 2,  d: 19 }, kanji: "土脉潤起",   romaji: "Tsuchi no shō uruoi okoru", en: "Rain moistens the soil",                       laNote: "Coincides with LA's tail-end of winter rains.", plantIds: ["japanese-camellia"] },
  { index: 5,  start: { m: 2,  d: 24 }, kanji: "霞始靆",     romaji: "Kasumi hajimete tanabiku",  en: "Mist starts to linger",                        laNote: "June Gloom previews — coastal marine layer begins to thicken at dawn." },
  { index: 6,  start: { m: 3,  d: 1  }, kanji: "草木萌動",   romaji: "Sōmoku mebae izuru",        en: "Grass and trees sprout",                       plantIds: ["wisteria", "japanese-magnolia"] },
  // 啓蟄 Keichitsu
  { index: 7,  start: { m: 3,  d: 6  }, kanji: "蟄虫啓戸",   romaji: "Sugomori mushi to o hiraku", en: "Hibernating insects open their doors",        laNote: "Carpenter bees and Anna's hummingbirds become constant visitors." },
  { index: 8,  start: { m: 3,  d: 11 }, kanji: "桃始笑",     romaji: "Momo hajimete saku",         en: "Peach trees start to bloom",                  plantIds: ["flowering-cherry", "evergreen-pear"] },
  { index: 9,  start: { m: 3,  d: 16 }, kanji: "菜虫化蝶",   romaji: "Namushi chō to naru",        en: "Caterpillars become butterflies",             laNote: "First painted ladies and cabbage whites." },
  // 春分 Shunbun
  { index: 10, start: { m: 3,  d: 21 }, kanji: "雀始巣",     romaji: "Suzume hajimete sukū",       en: "Sparrows start nesting" },
  { index: 11, start: { m: 3,  d: 26 }, kanji: "桜始開",     romaji: "Sakura hajimete hiraku",     en: "Cherry blossoms open",                        laNote: "JACCC's flowering cherry typically peaks 1–3 weeks earlier than Kyoto.", plantIds: ["flowering-cherry", "azalea"] },
  { index: 12, start: { m: 3,  d: 31 }, kanji: "雷乃発声",   romaji: "Kaminari sunawachi koe o hassu", en: "Distant thunder rolls",                   laNote: "Rare in LA — read as the last cold-front rumbles before dry season." },
  // 清明 Seimei
  { index: 13, start: { m: 4,  d: 5  }, kanji: "玄鳥至",     romaji: "Tsubame kitaru",             en: "Swallows return",                             laNote: "Cliff swallows arrive at LA mission bridges." },
  { index: 14, start: { m: 4,  d: 10 }, kanji: "鴻雁北",     romaji: "Kōgan kaeru",                en: "Wild geese fly north" },
  { index: 15, start: { m: 4,  d: 15 }, kanji: "虹始見",     romaji: "Niji hajimete arawaru",      en: "First rainbows appear",                       laNote: "Rare without rain — LA gets these only in spring storms." },
  // 穀雨 Kokuu
  { index: 16, start: { m: 4,  d: 20 }, kanji: "葭始生",     romaji: "Ashi hajimete shōzu",        en: "First reeds sprout",                          plantIds: ["madake-bamboo", "golden-bamboo"] },
  { index: 17, start: { m: 4,  d: 25 }, kanji: "霜止出苗",   romaji: "Shimo yamite nae izuru",     en: "Last frost; rice seedlings grow",             laNote: "LA's last frost is usually mid-February; reads as garden fully waking." },
  { index: 18, start: { m: 4,  d: 30 }, kanji: "牡丹華",     romaji: "Botan hana saku",            en: "Peonies bloom",                               laNote: "Peonies struggle in LA — substitute: pittosporum and Indian hawthorn flowering.", plantIds: ["japanese-pittosporum", "indian-hawthorne"] },
  // 立夏 Rikka
  { index: 19, start: { m: 5,  d: 5  }, kanji: "蛙始鳴",     romaji: "Kawazu hajimete naku",       en: "Frogs start singing",                         laNote: "Pacific tree frogs in JACCC's water feature." },
  { index: 20, start: { m: 5,  d: 10 }, kanji: "蚯蚓出",     romaji: "Mimizu izuru",               en: "Earthworms surface" },
  { index: 21, start: { m: 5,  d: 15 }, kanji: "竹笋生",     romaji: "Takenoko shōzu",             en: "Bamboo shoots sprout",                        plantIds: ["madake-bamboo"] },
  // 小満 Shōman
  { index: 22, start: { m: 5,  d: 21 }, kanji: "蚕起食桑",   romaji: "Kaiko okite kuwa o hamu",    en: "Silkworms wake and feed on mulberry" },
  { index: 23, start: { m: 5,  d: 26 }, kanji: "紅花栄",     romaji: "Benibana sakau",             en: "Safflowers bloom",                            laNote: "Jacaranda begins to color the LA sky purple." },
  { index: 24, start: { m: 5,  d: 31 }, kanji: "麦秋至",     romaji: "Mugi no toki itaru",         en: "Wheat ripens and is harvested" },
  // 芒種 Bōshu
  { index: 25, start: { m: 6,  d: 6  }, kanji: "蟷螂生",     romaji: "Kamakiri shōzu",             en: "Praying mantises hatch" },
  { index: 26, start: { m: 6,  d: 11 }, kanji: "腐草為螢",   romaji: "Kusaretaru kusa hotaru to naru", en: "Rotting grass becomes fireflies",         laNote: "No fireflies in LA — read as the first deep-evening cricket chorus." },
  { index: 27, start: { m: 6,  d: 16 }, kanji: "梅子黄",     romaji: "Ume no mi kibamu",           en: "Plums turn yellow",                           laNote: "Tsuyu (plum rains) doesn't reach LA — June Gloom is the closest analogue." },
  // 夏至 Geshi
  { index: 28, start: { m: 6,  d: 21 }, kanji: "乃東枯",     romaji: "Natsukarekusa karuru",       en: "Self-heal withers",                           laNote: "LA hillsides go fully gold-brown.", plantIds: ["pomegranate"] },
  { index: 29, start: { m: 6,  d: 27 }, kanji: "菖蒲華",     romaji: "Ayame hana saku",            en: "Irises bloom",                                plantIds: ["fortnight-lily"] },
  { index: 30, start: { m: 7,  d: 2  }, kanji: "半夏生",     romaji: "Hange shōzu",                en: "Crow-dipper sprouts" },
  // 小暑 Shōsho
  { index: 31, start: { m: 7,  d: 7  }, kanji: "温風至",     romaji: "Atsukaze itaru",             en: "Warm winds blow",                             laNote: "First serious heat dome over the Inland Empire." },
  { index: 32, start: { m: 7,  d: 12 }, kanji: "蓮始開",     romaji: "Hasu hajimete hiraku",       en: "Lotus flowers open" },
  { index: 33, start: { m: 7,  d: 18 }, kanji: "鷹乃学習",   romaji: "Taka sunawachi waza o narau", en: "Young hawks learn to fly",                   laNote: "Red-tailed hawk fledglings practice over Boyle Heights." },
  // 大暑 Taisho
  { index: 34, start: { m: 7,  d: 23 }, kanji: "桐始結花",   romaji: "Kiri hajimete hana o musubu", en: "Paulownia trees set fruit",                  plantIds: ["crape-myrtle", "golden-rain-tree"] },
  { index: 35, start: { m: 7,  d: 29 }, kanji: "土潤溽暑",   romaji: "Tsuchi uruōte mushi atsushi", en: "Earth is damp, air is humid",                laNote: "Inverted in LA — earth is bone-dry; air can be humid only during monsoon surges." },
  { index: 36, start: { m: 8,  d: 3  }, kanji: "大雨時行",   romaji: "Taiu tokidoki furu",         en: "Great rains sometimes fall",                  laNote: "LA equivalent: monsoonal thunderstorms briefly reach the basin." },
  // 立秋 Risshū
  { index: 37, start: { m: 8,  d: 8  }, kanji: "涼風至",     romaji: "Suzukaze itaru",             en: "Cool winds first blow",                       laNote: "Sea breeze finally beats back the heat in late afternoon." },
  { index: 38, start: { m: 8,  d: 13 }, kanji: "寒蝉鳴",     romaji: "Higurashi naku",             en: "Evening cicadas sing" },
  { index: 39, start: { m: 8,  d: 18 }, kanji: "蒙霧升降",   romaji: "Fukaki kiri matō",           en: "Thick fog descends",                          laNote: "Coastal fog reaches deepest inland push of the year." },
  // 処暑 Shosho
  { index: 40, start: { m: 8,  d: 23 }, kanji: "綿柎開",     romaji: "Wata no hana shibe hiraku",  en: "Cotton bolls open" },
  { index: 41, start: { m: 8,  d: 28 }, kanji: "天地始粛",   romaji: "Tenchi hajimete samushi",    en: "Heaven and earth begin to cool",              laNote: "False in LA — September is often the hottest month." },
  { index: 42, start: { m: 9,  d: 2  }, kanji: "禾乃登",     romaji: "Kokumono sunawachi minoru", en: "Rice ripens",                                  plantIds: ["donated-persimmon", "pomegranate"] },
  // 白露 Hakuro
  { index: 43, start: { m: 9,  d: 8  }, kanji: "草露白",     romaji: "Kusa no tsuyu shiroshi",     en: "Dew glistens on grass" },
  { index: 44, start: { m: 9,  d: 13 }, kanji: "鶺鴒鳴",     romaji: "Sekirei naku",               en: "Wagtails start to sing" },
  { index: 45, start: { m: 9,  d: 18 }, kanji: "玄鳥去",     romaji: "Tsubame saru",               en: "Swallows depart" },
  // 秋分 Shūbun
  { index: 46, start: { m: 9,  d: 23 }, kanji: "雷乃収声",   romaji: "Kaminari sunawachi koe o osamu", en: "Thunder ceases" },
  { index: 47, start: { m: 9,  d: 28 }, kanji: "蟄虫坏戸",   romaji: "Mushi kakurete to o fusagu", en: "Insects shut their burrows" },
  { index: 48, start: { m: 10, d: 3  }, kanji: "水始涸",     romaji: "Mizu hajimete karuru",       en: "Farmers drain rice fields",                   laNote: "LA Aqueduct draws lowest as reservoirs hit annual minimum." },
  // 寒露 Kanro
  { index: 49, start: { m: 10, d: 8  }, kanji: "鴻雁来",     romaji: "Kōgan kitaru",               en: "Wild geese return" },
  { index: 50, start: { m: 10, d: 13 }, kanji: "菊花開",     romaji: "Kiku no hana hiraku",        en: "Chrysanthemums bloom",                        plantIds: ["sasanqua-camellia"] },
  { index: 51, start: { m: 10, d: 18 }, kanji: "蟋蟀在戸",   romaji: "Kirigirisu to ni ari",       en: "Crickets sing by the door" },
  // 霜降 Sōkō
  { index: 52, start: { m: 10, d: 23 }, kanji: "霜始降",     romaji: "Shimo hajimete furu",        en: "First frosts fall",                           laNote: "No frost in coastal LA — read as Santa Ana season fully arriving." },
  { index: 53, start: { m: 10, d: 28 }, kanji: "霎時施",     romaji: "Kosame tokidoki furu",       en: "Light rains sometimes fall" },
  { index: 54, start: { m: 11, d: 2  }, kanji: "楓蔦黄",     romaji: "Momiji tsuta kibamu",        en: "Maples and ivy turn yellow",                  laNote: "Japanese maples color late in LA — peak often early-to-mid November.", plantIds: ["japanese-maple", "japanese-elm"] },
  // 立冬 Rittō
  { index: 55, start: { m: 11, d: 7  }, kanji: "山茶始開",   romaji: "Tsubaki hajimete hiraku",    en: "Sasanqua camellias open",                     plantIds: ["sasanqua-camellia"] },
  { index: 56, start: { m: 11, d: 12 }, kanji: "地始凍",     romaji: "Chi hajimete kōru",          en: "Land begins to freeze",                       laNote: "Doesn't apply — substitute: first cold dawns under 50°F." },
  { index: 57, start: { m: 11, d: 17 }, kanji: "金盞香",     romaji: "Kinsenka saku",              en: "Daffodils bloom" },
  // 小雪 Shōsetsu
  { index: 58, start: { m: 11, d: 22 }, kanji: "虹蔵不見",   romaji: "Niji kakurete miezu",        en: "Rainbows hide" },
  { index: 59, start: { m: 11, d: 27 }, kanji: "朔風払葉",   romaji: "Kitakaze konoha o harau",    en: "North wind strips leaves",                    laNote: "Santa Ana wind events strip sycamores along the LA River." },
  { index: 60, start: { m: 12, d: 2  }, kanji: "橘始黄",     romaji: "Tachibana hajimete kibamu",  en: "Tachibana citrus turns yellow",               plantIds: ["heavenly-bamboo", "japanese-holly"] },
  // 大雪 Taisetsu
  { index: 61, start: { m: 12, d: 7  }, kanji: "閉塞成冬",   romaji: "Sora samuku fuyu to naru",   en: "Cold seals the sky into winter" },
  { index: 62, start: { m: 12, d: 12 }, kanji: "熊蟄穴",     romaji: "Kuma ana ni komoru",         en: "Bears retreat to dens" },
  { index: 63, start: { m: 12, d: 17 }, kanji: "鱖魚群",     romaji: "Sake no uo muragaru",        en: "Salmon swim upstream" },
  // 冬至 Tōji
  { index: 64, start: { m: 12, d: 22 }, kanji: "乃東生",     romaji: "Natsukarekusa shōzu",        en: "Self-heal sprouts" },
  { index: 65, start: { m: 12, d: 27 }, kanji: "麋角解",     romaji: "Sawashika no tsuno otsuru",  en: "Deer shed antlers" },
  { index: 66, start: { m: 1,  d: 1  }, kanji: "雪下出麦",   romaji: "Yuki watarite mugi nobiru",  en: "Wheat sprouts under snow",                    laNote: "Mustard begins greening LA hillsides after the first soaking rain.", plantIds: ["dwarf-sacred-bamboo"] },
  // 小寒 Shōkan
  { index: 67, start: { m: 1,  d: 6  }, kanji: "芹乃栄",     romaji: "Seri sunawachi sakau",       en: "Parsley flourishes" },
  { index: 68, start: { m: 1,  d: 11 }, kanji: "水泉動",     romaji: "Shimizu atataka o fukumu",   en: "Springs start to thaw" },
  { index: 69, start: { m: 1,  d: 16 }, kanji: "雉始雊",     romaji: "Kiji hajimete naku",         en: "Pheasants start to call" },
  // 大寒 Daikan
  { index: 70, start: { m: 1,  d: 21 }, kanji: "款冬華",     romaji: "Fuki no hana saku",          en: "Butterbur flowers bloom",                     plantIds: ["japanese-camellia"] },
  { index: 71, start: { m: 1,  d: 26 }, kanji: "水沢腹堅",   romaji: "Sawamizu kōri tsumeru",      en: "Stream-ice thickens" },
  { index: 72, start: { m: 1,  d: 31 }, kanji: "鶏始乳",     romaji: "Niwatori hajimete toya ni tsuku", en: "Hens start laying again" },
];

function dayOfYear(m: number, d: number): number {
  // Use a non-leap reference year so kō boundaries are stable
  return Math.floor((Date.UTC(2025, m - 1, d) - Date.UTC(2025, 0, 1)) / 86400000);
}

const sortedByDoy = kou72
  .map((k) => ({ k, doy: dayOfYear(k.start.m, k.start.d) }))
  .sort((a, b) => a.doy - b.doy);

export function currentKou(date = new Date()): Kou {
  const doy = Math.floor(
    (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
      Date.UTC(date.getUTCFullYear(), 0, 1)) /
      86400000,
  );
  let chosen = sortedByDoy[sortedByDoy.length - 1].k; // default: latest before wrap
  for (const { k, doy: kdoy } of sortedByDoy) {
    if (kdoy <= doy) chosen = k;
    else break;
  }
  return chosen;
}

export function kouAt(index: number): Kou {
  const i = ((index - 1) % 72 + 72) % 72;
  return kou72[i];
}

// 24 sekki tint palette — one Nippon color per sekki, 3 kō share a tint.
// Ordered Risshun..Daikan to match kou72 indices 1..72.
export const sekkiPalette: { name: string; hex: string }[] = [
  { name: "東雲 Shinonome",       hex: "#f19483" }, // Risshun
  { name: "桜色 Sakura-iro",      hex: "#fdeff2" }, // Usui
  { name: "若苗 Wakanae",         hex: "#c3d825" }, // Keichitsu
  { name: "桃色 Momo-iro",        hex: "#f47983" }, // Shunbun
  { name: "萌黄 Moegi",           hex: "#aacf53" }, // Seimei
  { name: "若葉 Wakaba",          hex: "#b9d08b" }, // Kokuu
  { name: "若竹 Wakatake",        hex: "#7ebeab" }, // Rikka
  { name: "青磁 Seiji",           hex: "#93b69c" }, // Shōman
  { name: "緑青 Rokushō",         hex: "#3c7170" }, // Bōshu
  { name: "瑠璃 Ruri",            hex: "#1e50a2" }, // Geshi
  { name: "白群 Byakugun",        hex: "#83ccd2" }, // Shōsho
  { name: "藍鉄 Aitetsu",         hex: "#2a4073" }, // Taisho
  { name: "桔梗 Kikyō",           hex: "#6a5acd" }, // Risshū
  { name: "蘇芳 Suō",             hex: "#9e3d3f" }, // Shosho
  { name: "黄朽葉 Kikuchiba",     hex: "#d3a243" }, // Hakuro
  { name: "金茶 Kincha",          hex: "#b7702d" }, // Shūbun
  { name: "柿 Kaki",              hex: "#ed6d3d" }, // Kanro
  { name: "紅葉 Momiji",          hex: "#bb5535" }, // Sōkō
  { name: "山吹 Yamabuki",        hex: "#f8b500" }, // Rittō
  { name: "枯茶 Karecha",         hex: "#674c38" }, // Shōsetsu
  { name: "鈍色 Nibi-iro",        hex: "#727171" }, // Taisetsu
  { name: "胡粉 Gofun",           hex: "#fffffc" }, // Tōji
  { name: "紅梅 Kōbai",           hex: "#d05a6e" }, // Shōkan
  { name: "藍墨茶 Aisumicha",     hex: "#363c46" }, // Daikan
];

export function tintForKou(index: number): { name: string; hex: string } {
  const sekkiIdx = Math.floor((((index - 1) % 72) + 72) % 72 / 3);
  return sekkiPalette[sekkiIdx];
}
