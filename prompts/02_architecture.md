# 아키텍처 및 설계 (Architecture & Design)

## 디렉토리 구조

emoji-recommender-extension/
├── public/                 # Next.js 정적 파일 및 크롬 확장 프로그램 자원
│   ├── manifest.json       # 크롬 확장 프로그램 메인 설정 파일
│   └── icons/              # 확장 프로그램 아이콘
├── src/
│   ├── app/                # 전역 로직 및 초기화
│   │   ├── providers/      # Context, 전역 상태 관리
│   │   └── index.ts        # 확장 프로그램 메인 Entry (Next.js App Wrapper)
│   ├── pages/              # 라우팅 가능한 페이지 (확장 프로그램의 메인 팝업 UI)
│   │   └── MainPopup/      # 메인 팝업 화면 (HotkeySettings, Review 팝업 등을 포함하는 컨테이너)
│   │       └── index.tsx
│   ├── widgets/            # 컴포넌트 조합 (여러 엔티티/기능을 결합)
│   │   ├── HotkeyChanger/  # 핫키 변경 팝업 UI
│   │   ├── RecommendationList/ # 추천 이모지 목록 표시 (실제 이모지 추천 로직을 호출)
│   │   └── ReviewForm/     # 리뷰 작성 팝업 UI
│   ├── features/           # 사용자 액션 및 비즈니스 로직 (핫키 감지, 이모지 삽입)
│   │   ├── emoji-recommendation/ # 텍스트 분석 및 추천 핵심 기능
│   │   │   └── api/        # Supabase Edge Function 호출 로직
│   │   ├── usage-tracking/ # 사용 횟수 기반 팝업 호출 로직
│   │   └── hotkey-binding/ # 핫키 바인딩 및 감지 로직
│   ├── entities/           # 비즈니스 객체 및 데이터 모델
│   │   ├── emoji/          # 이모지 데이터 모델 및 관련 로직
│   │   ├── user/           # 사용자 데이터 (user_id, has_reviewed, custom_hotkey)
│   │   └── review/         # 리뷰 데이터 모델
│   ├── shared/             # 재사용 가능한 유틸리티, UI 컴포넌트, 타입 등
│   │   ├── api/            # 일반적인 API 통신 기본 설정
│   │   ├── lib/            # 유틸리티 함수 (클립보드 접근, 커서 위치 파악)
│   │   ├── ui/             # 디자인 시스템 (Button, Input, RoundedContainer 등)
│   │   └── types/          # 공통 타입 정의
│   ├── background/         # ⚙️ 크롬 확장 프로그램 Background Service Worker
│   │   └── index.ts        # FSD 'features'의 로직을 호출하여 핫키 감지 및 API 통신 수행
└── ...                     # Next.js 기본 파일

## 데이터 구조

### emojis_minilm (Active)
| 컬럼명 | 타입 | 설명 |
| :--- | :--- | :--- |
| emoji_id | TEXT | 이모지 유니코드 (PK) |
| description | TEXT | 이모지에 대한 설명 |
| version | FLOAT | 이모지 버전 |
| embedding | VECTOR(384) | all-MiniLM-L6-v2 임베딩 (Client-side) |

### user_metadata
| 컬럼명 | 타입 | 설명 |
| :--- | :--- | :--- |
| user_id | UUID | Google UID |
| has_reviewed | BOOLEAN |	리뷰를 작성했는지 여부 (리뷰 작성 시 팝업창을 띄우지 않음) | 
| custom_hotkey | TEXT | 사용자가 설정한 핫키 조합 (예: 'Control+Shift+E') |
| usage_count |	INT | 이모지 추천 기능 호출 횟수 (10회 호출 시 리뷰 팝업 트리거에 사용) |

### reviews
| 컬럼명 | 타입 | 설명 | 
| :--- | :--- | :--- |
| review_id | UUID | 리뷰 고유 ID (PK) |
| user_id | TEXT | 리뷰를 작성한 사용자 ID (FK) | 
| rating | INT | 별점 (1~5) | 
| comment | TEXT | 리뷰 내용 | 
| created_at | TIMESTAMP | 리뷰 작성 시간 |

## API 명세 (필요시)

### 텍스트 분석 및 이모지 추천 API

| 속성 | 값 |
| :-- | :-- |
| 엔드포인트 | POST /api/recommend-emoji |
| 호출 주제 | background Worker (features/emoji-recommendation) |
| 요청 본문 | {emoji_vectors: '233.123.41.23.451.23.412'} |
| 응답 본문 | { "status": "success", "recommendations": ["👍", "🔥", "😊"] } |

### 사용 횟수 업데이트 및 리뷰 상태 확인 API
| 속성 | 값 |
| :-- | :-- |
| 엔드포인트 |	POST /api/update-usage |
| 호출 주체 |	background Worker (features/usage-tracking 로직 내) |
| 응답 본문 |  { "status": "success", "new_count": 1, "show_review_popup": true/false } |

### 리뷰 제출 API
| 속성 | 값 |
| :-- | :-- |
| 엔드포인트 | POST /api/submit-review |
| 호출 주체 | widgets/ReviewForm |
| 요청 본문 | { "user_id": "ID", "rating": 5, "comment": "좋아요" } |
| 응답 본문 | { "status": "success" } |