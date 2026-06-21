import { defaultLocale } from "@/i18n/routing";
import type {
  CommerceProvider,
  CurrencyCode,
  GetProductOptions,
  ListProductsOptions,
  Money,
  Product,
  ProductListItem,
} from "./types";

// Temporary in-memory catalog used ONLY when Supabase env vars are absent.
// Mirrors supabase/seed.sql so the prototype renders identically. When real
// Supabase keys land in .env.local, index.ts auto-switches to the DB provider.

type Localized = Record<string, string>;

interface MockVariant {
  id: string;
  sku: string;
  label: Localized;
}

interface MockProduct {
  id: string;
  handle: string;
  ipFranchise: string;
  prices: Record<CurrencyCode, number>; // amount_minor
  title: Localized;
  subtitle: Localized;
  variants: MockVariant[];
}

const PRODUCTS: MockProduct[] = [
  {
    id: "aot-acrylic-stand",
    handle: "aot-acrylic-stand",
    ipFranchise: "Attack on Titan",
    prices: { KRW: 18000, JPY: 1800, USD: 1500, CNY: 9800 },
    title: {
      ko: "진격의 거인 아크릴 스탠드",
      en: "Attack on Titan Acrylic Stand",
      ja: "進撃の巨人 アクリルスタンド",
      zh: "进击的巨人 亚克力立牌",
    },
    subtitle: {
      ko: "공식 라이선스 굿즈",
      en: "Officially licensed goods",
      ja: "公式ライセンスグッズ",
      zh: "官方授权周边",
    },
    variants: [],
  },
  {
    id: "jjk-tshirt",
    handle: "jjk-tshirt",
    ipFranchise: "Jujutsu Kaisen",
    prices: { KRW: 32000, JPY: 3200, USD: 2800, CNY: 18000 },
    title: {
      ko: "주술회전 티셔츠",
      en: "Jujutsu Kaisen T-Shirt",
      ja: "呪術廻戦 Tシャツ",
      zh: "咒术回战 T恤",
    },
    subtitle: {
      ko: "공연 한정판",
      en: "Show-limited edition",
      ja: "公演限定版",
      zh: "演出限定版",
    },
    variants: ["S", "M", "L"].map((size) => ({
      id: `jjk-${size}`,
      sku: `JJK-TEE-${size}`,
      label: { ko: size, en: size, ja: size, zh: size },
    })),
  },
  {
    id: "ff-piano-score",
    handle: "ff-piano-score",
    ipFranchise: "Final Fantasy",
    prices: { KRW: 45000, JPY: 4500, USD: 3900, CNY: 25000 },
    title: {
      ko: "파이널 판타지 피아노 악보집",
      en: "Final Fantasy Piano Score Book",
      ja: "ファイナルファンタジー ピアノ楽譜集",
      zh: "最终幻想 钢琴谱集",
    },
    subtitle: {
      ko: "콘서트 공식 악보",
      en: "Official concert score",
      ja: "コンサート公式楽譜",
      zh: "音乐会官方乐谱",
    },
    variants: [],
  },
  {
    id: "lionking-tote",
    handle: "lionking-tote",
    ipFranchise: "The Lion King",
    prices: { KRW: 25000, JPY: 2500, USD: 2200, CNY: 14000 },
    title: {
      ko: "라이온 킹 에코백",
      en: "The Lion King Tote Bag",
      ja: "ライオン・キング トートバッグ",
      zh: "狮子王 帆布袋",
    },
    subtitle: {
      ko: "30주년 기념",
      en: "30th anniversary",
      ja: "30周年記念",
      zh: "30周年纪念",
    },
    variants: [],
  },
  // Lion King 30th Anniversary × Zootopia 2 — MD list (2025)
  {
    id: "lk-keyring-simba-nala",
    handle: "lk-keyring-simba-nala",
    ipFranchise: "The Lion King",
    prices: { KRW: 12000, JPY: 1200, USD: 950, CNY: 6200 },
    title: {
      ko: "라이온 킹 금속키링 - 심바와 날라",
      en: "Lion King Metal Keyring – Simba & Nala",
      ja: "ライオン・キング メタルキーリング – シンバ＆ナラ",
      zh: "狮子王金属钥匙扣 – 辛巴与娜娜",
    },
    subtitle: {
      ko: "라이온 킹 30주년 라이브 인 콘서트 MD",
      en: "Lion King 30th Live in Concert MD",
      ja: "ライオン・キング 30周年 ライブ・イン・コンサート MD",
      zh: "狮子王30周年演唱会周边",
    },
    variants: [],
  },
  {
    id: "lk-keyring-simba-purple",
    handle: "lk-keyring-simba-purple",
    ipFranchise: "The Lion King",
    prices: { KRW: 12000, JPY: 1200, USD: 950, CNY: 6200 },
    title: {
      ko: "라이온 킹 금속키링 - 심바와 자주",
      en: "Lion King Metal Keyring – Simba & Purple",
      ja: "ライオン・キング メタルキーリング – シンバ＆パープル",
      zh: "狮子王金属钥匙扣 – 辛巴与紫色款",
    },
    subtitle: {
      ko: "라이온 킹 30주년 라이브 인 콘서트 MD",
      en: "Lion King 30th Live in Concert MD",
      ja: "ライオン・キング 30周年 ライブ・イン・コンサート MD",
      zh: "狮子王30周年演唱会周边",
    },
    variants: [],
  },
  {
    id: "lk-coaster",
    handle: "lk-coaster",
    ipFranchise: "The Lion King",
    prices: { KRW: 9500, JPY: 950, USD: 750, CNY: 4900 },
    title: {
      ko: "라이온 킹 컵받침 코스터",
      en: "Lion King Cup Coaster Set",
      ja: "ライオン・キング コースターセット",
      zh: "狮子王杯垫套装",
    },
    subtitle: {
      ko: "라이온 킹 30주년 라이브 인 콘서트 MD",
      en: "Lion King 30th Live in Concert MD",
      ja: "ライオン・キング 30周年 ライブ・イン・コンサート MD",
      zh: "狮子王30周年演唱会周边",
    },
    variants: [],
  },
  {
    id: "zootopia2-sticker-pack",
    handle: "zootopia2-sticker-pack",
    ipFranchise: "Zootopia 2",
    prices: { KRW: 12000, JPY: 1200, USD: 950, CNY: 6200 },
    title: {
      ko: "주토피아2 스티커팩",
      en: "Zootopia 2 Sticker Pack",
      ja: "ズートピア2 ステッカーパック",
      zh: "疯狂动物城2贴纸包",
    },
    subtitle: {
      ko: "주토피아2 공식 MD",
      en: "Zootopia 2 Official MD",
      ja: "ズートピア2 公式 MD",
      zh: "疯狂动物城2官方周边",
    },
    variants: [],
  },
  {
    id: "zootopia2-memo-set",
    handle: "zootopia2-memo-set",
    ipFranchise: "Zootopia 2",
    prices: { KRW: 12000, JPY: 1200, USD: 950, CNY: 6200 },
    title: {
      ko: "주토피아2 메모지 세트",
      en: "Zootopia 2 Memo Note Set",
      ja: "ズートピア2 メモ帳セット",
      zh: "疯狂动物城2便利贴套装",
    },
    subtitle: {
      ko: "주토피아2 공식 MD",
      en: "Zootopia 2 Official MD",
      ja: "ズートピア2 公式 MD",
      zh: "疯狂动物城2官方周边",
    },
    variants: [],
  },
  {
    id: "zootopia2-pouch-judy-nick",
    handle: "zootopia2-pouch-judy-nick",
    ipFranchise: "Zootopia 2",
    prices: { KRW: 12000, JPY: 1200, USD: 950, CNY: 6200 },
    title: {
      ko: "주토피아2 미니 파우치 - 주디&닉",
      en: "Zootopia 2 Mini Pouch – Judy & Nick",
      ja: "ズートピア2 ミニポーチ – ジュディ＆ニック",
      zh: "疯狂动物城2迷你收纳袋 – 朱迪&尼克",
    },
    subtitle: {
      ko: "주토피아2 공식 MD",
      en: "Zootopia 2 Official MD",
      ja: "ズートピア2 公式 MD",
      zh: "疯狂动物城2官方周边",
    },
    variants: [],
  },
  {
    id: "zootopia2-l-holder-judy-nick",
    handle: "zootopia2-l-holder-judy-nick",
    ipFranchise: "Zootopia 2",
    prices: { KRW: 4000, JPY: 400, USD: 320, CNY: 2000 },
    title: {
      ko: "주토피아2 L홀더 - 주디&닉",
      en: "Zootopia 2 L-Holder – Judy & Nick",
      ja: "ズートピア2 Lホルダー – ジュディ＆ニック",
      zh: "疯狂动物城2 L型文件夹 – 朱迪&尼克",
    },
    subtitle: {
      ko: "주토피아2 공식 MD",
      en: "Zootopia 2 Official MD",
      ja: "ズートピア2 公式 MD",
      zh: "疯狂动物城2官方周边",
    },
    variants: [],
  },
  {
    id: "zootopia2-l-holder-all",
    handle: "zootopia2-l-holder-all",
    ipFranchise: "Zootopia 2",
    prices: { KRW: 4000, JPY: 400, USD: 320, CNY: 2000 },
    title: {
      ko: "주토피아2 L홀더 - 주디&닉&피닉",
      en: "Zootopia 2 L-Holder – Judy, Nick & Finnick",
      ja: "ズートピア2 Lホルダー – ジュディ＆ニック＆フィニック",
      zh: "疯狂动物城2 L型文件夹 – 全角色款",
    },
    subtitle: {
      ko: "주토피아2 공식 MD",
      en: "Zootopia 2 Official MD",
      ja: "ズートピア2 公式 MD",
      zh: "疯狂动物城2官方周边",
    },
    variants: [],
  },
];

function tr(map: Localized, locale: string): string {
  return map[locale] ?? map[defaultLocale] ?? map.en ?? Object.values(map)[0];
}

function price(p: MockProduct, currency: CurrencyCode): Money {
  return { currency, amountMinor: p.prices[currency] };
}

function toListItem(p: MockProduct, locale: string, currency: CurrencyCode): ProductListItem {
  return {
    id: p.id,
    handle: p.handle,
    title: tr(p.title, locale),
    subtitle: tr(p.subtitle, locale),
    ipFranchise: p.ipFranchise,
    price: price(p, currency),
  };
}

export const mockCommerce: CommerceProvider = {
  async listProducts({ locale, currency }: ListProductsOptions) {
    return PRODUCTS.map((p) => toListItem(p, locale, currency));
  },

  async getProduct({ handle, locale, currency }: GetProductOptions) {
    const p = PRODUCTS.find((x) => x.handle === handle);
    if (!p) return null;
    const product: Product = {
      ...toListItem(p, locale, currency),
      variants: p.variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        label: tr(v.label, locale),
      })),
    };
    return product;
  },
};
