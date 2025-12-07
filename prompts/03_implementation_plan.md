# 구현 계획 (Implementation Plan)

## 단계별 작업
1단계: 이모지 저장 및 임베딩
- Emojibase라는 js 라이브러리를 이용해서 데이터 셋을 관리한다.

2단계: 인프라 및 환경 설정 (Setup & Backend)

| 작업 내용 | 담당 모듈/기술 |
| :-- | :-- | :-- |
| 프로젝트 초기 설정 (Next.js, TypeScript, Linter, FSD 구조 적용) | Next.js, FSD |
| Supabase 초기 설정 및 DB 스키마 생성 (emojis, user_preferences, reviews) | Supabase DB |
| LLM (Gemini Pro 3) 연동 및 이모지 벡터 사전 생성 (Embedding) | Gemini API, Python/Script |
| emojis 테이블에 벡터 데이터 사전 저장 | Supabase DB |
| Supabase Edge Function 환경 설정 (Deno) 및 Secrets 관리 | Supabase Edge Function |

3단계, 4단계는 1단계 완료 후 추가할 예정
