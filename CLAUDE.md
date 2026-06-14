# polarbearmini_commerce

H&H Company IP(폴라베어미니 등) 굿즈 글로벌 커머스 플랫폼.  
브랜드명: **Polaris Atelier** — https://polarisatelierkorea.com

## 레포 구조

| 디렉토리 | 설명 |
|----------|------|
| `storefront/` | Next.js 16 프론트엔드 (메인 앱) |
| `supabase/` | DB 스키마 마이그레이션 및 시드 데이터 |
| `_automation/` | Gabia DNS 관리용 Chrome CDP 스크립트 — **git 미추적, 로컬에만 존재** |
| `_screenshots/` | 작업 중 캡처 스크린샷 — git 미추적 |

앱 코드 작업은 `storefront/`로 이동해서 `storefront/CLAUDE.md`를 읽을 것.

## 개발 단계 (Phase)

- **Phase B (현재)**: Next.js + Supabase 직접 연결 프로토타입 운영 중
- **Phase A (예정)**: Supabase 백엔드를 Medusa로 교체 — `storefront/`의 UI와 `CommerceProvider` 인터페이스는 그대로 유지, 구현체만 교체

## 배포

- 플랫폼: Vercel (자동 배포, main 브랜치 push 시 트리거)
- 도메인: polarisatelierkorea.com (Gabia 등록, DNS는 Vercel nameserver로 위임)
- DNS 변경이 필요하면 `_automation/` 스크립트 사용 (Chrome이 열려 있어야 함)

## Supabase 마이그레이션

```bash
# storefront/.env.local의 Supabase 키 필요
cd storefront && npm run db:setup
```

마이그레이션 파일은 `supabase/migrations/`에 순번 prefix로 관리 (`0001_catalog.sql` 등).  
파일을 직접 수정하지 말고, 변경이 필요하면 새 마이그레이션 파일을 추가할 것.

## 하지 말 것

- `_automation/`의 스크립트에 Gabia 로그인 정보를 하드코딩하지 말 것 — 인증은 브라우저 세션에만 존재해야 함
- `.env.local` 커밋 금지 (gitignore에 포함됨)
- 기존 마이그레이션 파일 수정 금지 — 이미 운영 DB에 적용된 상태
