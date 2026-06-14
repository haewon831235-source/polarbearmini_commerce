@AGENTS.md

# Storefront

H&H Company IP 굿즈 커머스. 현재 Phase B (Supabase 직접 연결) 운영 중이며, 나중에 Phase A (Medusa)로 전환 예정.

배포: https://polarisatelierkorea.com (브랜드명: Polaris Atelier)

## 개발 서버 실행

```bash
export PATH="$HOME/.local/bin:$PATH"   # Node.js 위치
cd storefront && npm run dev
```

`.env.local`에 Supabase 키가 없으면 자동으로 mock 데이터로 동작한다 (의도된 설계).

## 아키텍처 불변 규칙

**UI → Commerce 인터페이스 → 백엔드** 계층을 반드시 지킨다.

- UI 코드는 `src/lib/commerce`만 import한다. 페이지나 컴포넌트에서 Supabase 클라이언트를 직접 import하지 말 것 (인증/결제 제외).
- `src/lib/commerce/types.ts`의 `CommerceProvider` 인터페이스가 UI와 백엔드 사이의 안정적인 계약이다. 이 타입을 바꾸면 `mock.ts`와 `supabase.ts` 구현체를 모두 함께 수정해야 한다.
- Phase A 전환 시 이 인터페이스를 Medusa 구현체로 교체하고 UI는 건드리지 않는다.

## 다국어 (next-intl v4)

- 지원 로케일: `ko` (기본), `ja`, `zh`, `en`
- 모든 라우트는 `/[locale]/...` 형태 (localePrefix: "always")
- 번역 파일: `messages/{ko,ja,zh,en}.json`
- 로케일별 통화: KRW / JPY / CNY / USD (자동 환율 변환 없음, 별도 가격 설정)

## PortOne 결제

현재 **비활성화** 상태. `PORTONE_*` 환경 변수를 설정하고 재배포하면 활성화된다. 환경 변수 없이 결제 관련 코드(`src/lib/payment/`, `src/components/portone-pay-button.tsx`)를 수정하지 말 것.

## 하지 말 것

- `src/lib/commerce/types.ts`의 `Money` 타입 구조 변경 — amountMinor는 최소 화폐 단위 (KRW·JPY는 정수, USD·CNY는 1/100)
- shadcn 컴포넌트를 직접 작성하지 말 것 — `npx shadcn add <component>`로 추가하고 `src/components/ui/`에 위치시킴
- Tailwind config 파일(`tailwind.config.js`) 생성 금지 — v4는 CSS-first 설정 방식
