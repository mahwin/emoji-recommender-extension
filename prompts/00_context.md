# 프로젝트 컨텍스트 (Project Context)

## 프로젝트 개요
- 프로젝트 이름 : Emoji Recommender Extension
- 목적 : 사용자가 복사한 텍스트의 감정·의도·상황을 분석하여 알맞은 이모지를 자동으로 추천해주는 감성형 크롬 확장 프로그램
- 주요 기능 : 
    1) 복사된 텍스트 분석
    2) 감정·상황 기반 이모지 자동 생성

## 기술 스택
- 프론트 : Next.js를 사용하되 static 하게 배포할 예정
- 백엔드 : 없음
- db : Supabase

## 디자인 가이드라인
### 스타일 :
    1. 전체적인 무드는 귀엽고 가벼운 감성(Z세대 느낌)
    2. UI 컴포넌트는 모두 둥근 모서리(radius 12~18px)
    3. 작은 팝업 유지
    4. 텍스트는 가벼운 Sans-serif 사용(Inter, Noto Sans, Pretendard)
    
### 색상 팔레트 :

- 브랜드 메인 색 : #FFB800 (Warm Emoji Yellow)
- 보조 색 : #F58DC6 또는 #87BFFF
- 배경 : #FFFFFF · #F5F7FA
- 텍스트 : #2D2D2D / #666666
- 강조 : #A08BFF · #75D26B · #FF6464
