// Display helpers for the admin dashboard (Korean-only, KST).

const ZERO_DECIMAL = new Set(["KRW", "JPY"]);

export function formatAmount(
  amountMinor: number | null,
  currency: string | null,
): string {
  if (amountMinor == null) return "—";
  const cur = currency ?? "KRW";
  const value = ZERO_DECIMAL.has(cur) ? amountMinor : amountMinor / 100;
  return `${value.toLocaleString("ko-KR")} ${cur}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const STATUS_LABEL: Record<string, string> = {
  started: "진행중",
  paid: "결제완료",
  failed: "실패",
  error: "오류",
};

export const ERROR_REASON_LABEL: Record<string, string> = {
  "empty-cart": "빈 장바구니",
  "lookup-failed": "PG 조회 실패",
  "lookup-error": "PG 조회 오류",
  "verification-failed": "금액·상태 검증 실패",
  "sdk-cancel": "사용자 취소",
  "sdk-failure": "결제창 오류",
};
