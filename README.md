# 상품 관리 애플리케이션

이미지 업로드 기능이 포함된 현대적인 React + TypeScript 웹 애플리케이션입니다.

## 주요 기능

- **대시보드**: 상품 통계 및 최근 상품 개요
- **상품 관리**: 상품 생성, 편집 및 삭제
- **이미지 업로드**: 미리보기 기능이 있는 상품 이미지 업로드
- **반응형 디자인**: Tailwind CSS로 구축된 현대적인 UI
- **TypeScript**: 더 나은 개발 경험을 위한 완전한 타입 지원
- **API 통합**: Bearer 토큰 인증이 포함된 Axios 기반 API 서비스

## 기술 스택

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Hooks** for state management

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── Header.tsx      # 애플리케이션 헤더
│   ├── Sidebar.tsx     # 네비게이션 사이드바
│   ├── ProductForm.tsx # 상품 생성/편집 폼
│   ├── ProductList.tsx # 상품 그리드 표시
│   └── index.ts        # 컴포넌트 내보내기
├── services/           # API 서비스
│   └── api.ts         # Axios 설정 및 API 메서드
├── types/             # TypeScript 인터페이스
│   └── index.ts       # 타입 정의
├── App.tsx            # 메인 애플리케이션 컴포넌트
└── index.tsx          # 애플리케이션 진입점
```

## API 통합

애플리케이션은 다음을 포함하는 REST API와 함께 작동하도록 구성되어 있습니다:

- **인증**: Bearer 토큰 기반 인증
- **상품 엔드포인트**: 상품에 대한 CRUD 작업
- **이미지 업로드**: 이미지 업로드를 위한 별도 엔드포인트

### API 엔드포인트

- `GET /api/products` - 모든 상품 조회
- `GET /api/products/:id` - 특정 상품 조회
- `POST /api/products` - 새 상품 생성
- `PATCH /api/products/:id` - 상품 업데이트
- `DELETE /api/products/:id` - 상품 삭제
- `POST /api/upload/image` - 이미지 업로드

## 시작하기

1. **의존성 설치**:
   ```bash
   npm install
   ```

2. **개발 서버 시작**:
   ```bash
   npm start
   ```

3. **프로덕션 빌드**:
   ```bash
   npm run build
   ```

## 환경 변수

루트 디렉토리에 `.env` 파일을 생성하세요:

```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

## 상세 기능

### 상품 생성
- 모든 필수 필드에 대한 폼 검증
- 미리보기가 있는 이미지 업로드
- 자동 이미지 키 생성
- 오류 처리 및 로딩 상태

### 상품 편집
- 기존 데이터로 미리 채워진 폼
- 선택적 이미지 재업로드
- 효율적인 업데이트를 위한 PATCH 요청
- 새 업로드가 없으면 기존 이미지 유지

### 상품 목록
- 반응형 그리드 레이아웃
- 이미지, 가격 및 카테고리가 있는 상품 카드
- 편집 및 삭제 작업
- 로딩 및 빈 상태

### 대시보드
- 상품 통계 개요
- 최근 상품 표시
- 상품 관리로의 빠른 네비게이션

## 개발 노트

- 애플리케이션에는 데모 목적의 모의 데이터가 포함되어 있습니다
- API 호출은 오류 처리를 위해 try-catch 블록으로 래핑되어 있습니다
- 모든 컴포넌트는 TypeScript로 완전히 타입이 지정되어 있습니다
- Tailwind CSS 클래스는 반응형 디자인을 제공합니다
- Bearer 토큰 인증은 Axios 인터셉터에서 구성됩니다

## 향후 개선 사항

- 검색 및 필터링 기능
- 대용량 상품 목록을 위한 페이지네이션
- 고급 이미지 편집 기능
- 사용자 인증 및 권한 부여
- 상품 카테고리 관리
- 내보내기/가져오기 기능
