import type { ProductListItem } from "@/lib/commerce/types";

// Zero-dependency, no-API "brain" for the voice shopping assistant.
//
// The prototype (per plan: free / no API keys) understands the shopper's
// transcript with keyword matching against the localized product catalog,
// instead of an LLM. The result is a structured intent the React layer turns
// into a spoken sentence via next-intl `t()` — keeping all wording in the
// `Voice` message namespace. Swapping this for a Claude-backed engine later
// only touches this file.

export type AnswerResult =
  | { kind: "greeting" }
  | { kind: "help" }
  | { kind: "list"; products: ProductListItem[] }
  | { kind: "price"; product: ProductListItem }
  | { kind: "info"; product: ProductListItem }
  | { kind: "notFound" }
  | { kind: "fallback" };

type IntentKey = "greeting" | "help" | "price" | "list";

// Trigger words per locale. This is matching logic, not user-facing copy, so it
// lives here rather than in messages/*.json.
const KEYWORDS: Record<string, Record<IntentKey, string[]>> = {
  ko: {
    greeting: ["안녕", "하이", "헬로"],
    help: ["뭐 할", "뭘 할", "도와", "도움", "어떻게 써", "기능"],
    price: ["얼마", "가격", "값", "비싸", "금액"],
    list: ["뭐 있", "무슨", "상품", "목록", "추천", "보여", "팔아", "굿즈"],
  },
  ja: {
    greeting: ["こんにちは", "やあ", "はじめまして", "ハロー"],
    help: ["何ができ", "ヘルプ", "使い方", "機能"],
    price: ["いくら", "値段", "価格", "金額"],
    list: ["商品", "なに", "何が", "おすすめ", "リスト", "見せ", "グッズ"],
  },
  zh: {
    greeting: ["你好", "您好", "哈喽"],
    help: ["能做", "帮助", "怎么用", "功能"],
    price: ["多少钱", "价格", "价钱", "多少"],
    list: ["有什么", "商品", "推荐", "列表", "看看", "周边"],
  },
  en: {
    greeting: ["hello", "hi ", "hey", "good morning", "good evening"],
    help: ["help", "what can you", "how do", "how does", "what do you do"],
    price: ["price", "cost", "how much", "expensive", "how many won"],
    list: ["what do you", "what's available", "products", "list", "recommend", "show me", "sell", "goods"],
  },
};

function hasAny(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w.trim()));
}

/** Significant tokens of a product title/franchise used for fuzzy matching. */
function productTokens(p: ProductListItem): string[] {
  const source = `${p.title} ${p.ipFranchise ?? ""}`.toLowerCase();
  // Split on whitespace for spaced scripts (en) and keep whole title for CJK,
  // which the substring check below also covers.
  return source
    .split(/[\s,./·]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

function matchProduct(
  text: string,
  products: ProductListItem[],
): ProductListItem | undefined {
  const lower = text.toLowerCase();
  let best: { product: ProductListItem; score: number } | undefined;
  for (const p of products) {
    let score = 0;
    // Whole localized title appearing verbatim is the strongest signal (CJK).
    if (lower.includes(p.title.toLowerCase())) score += 10;
    for (const tok of productTokens(p)) {
      if (lower.includes(tok)) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) best = { product: p, score };
  }
  return best?.product;
}

/**
 * Interpret a raw speech transcript into a structured answer intent.
 * Pure and synchronous so it is trivially unit-testable.
 */
export function interpretQuery(
  transcript: string,
  products: ProductListItem[],
  locale: string,
): AnswerResult {
  const text = transcript.trim().toLowerCase();
  if (!text) return { kind: "fallback" };

  const kw = KEYWORDS[locale] ?? KEYWORDS.en;
  const product = matchProduct(text, products);
  const wantsPrice = hasAny(text, kw.price);

  // A named product dominates: answer about it (price vs. general info).
  if (product) {
    return wantsPrice ? { kind: "price", product } : { kind: "info", product };
  }

  // Price asked but no product caught → nudge to browse the catalog.
  if (wantsPrice) return { kind: "list", products };

  if (hasAny(text, kw.greeting)) return { kind: "greeting" };
  if (hasAny(text, kw.help)) return { kind: "help" };
  if (hasAny(text, kw.list)) return { kind: "list", products };

  return { kind: "fallback" };
}
