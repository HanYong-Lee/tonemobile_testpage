# SKT 티원모바일 용문점 1주년 행사 랜딩페이지

GitHub Pages에 바로 업로드할 수 있는 반응형 행사 홈페이지입니다.

## 포함 기능

- 모바일/PC 반응형 레이아웃
- 실시간 행사 D-Day 및 시·분·초 카운트다운
- PC 하단 고정 네이버 예약바
- 모바일 하단 전화 / 문자 / 예약 CTA
- 라이트모드 / 다크모드
- 행사 일정 자동 생성
- 스크롤 등장 애니메이션
- 네이버 예약, 전화, 문자, 길찾기 링크
- 자주 묻는 질문
- 별도 라이브러리 없이 작동

## 가장 먼저 수정할 파일

`js/config.js`

아래 항목을 실제 정보로 바꾸세요.

- `eventStart`: 행사 시작 날짜와 시간
- `reservationUrl`: 네이버 예약 주소
- `phone`: 매장 전화번호
- `smsMessage`: 문자 버튼 클릭 시 자동 입력할 내용
- `mapUrl`: 네이버 지도 또는 길찾기 주소
- `store.address`: 매장 주소
- `store.hours`: 영업시간
- `manager.name`: 개통 매니저 이름
- `manager.message`: 매니저 소개
- `schedule`: 행사 일정

## GitHub Pages 업로드 방법

1. GitHub에서 새 저장소를 만듭니다.
2. 압축을 해제한 뒤, 폴더 안의 모든 파일을 저장소 최상위에 업로드합니다.
3. 저장소의 `Settings` → `Pages`로 이동합니다.
4. `Build and deployment`에서 `Deploy from a branch`를 선택합니다.
5. 브랜치는 `main`, 폴더는 `/root`를 선택하고 저장합니다.
6. 잠시 후 생성된 GitHub Pages 주소로 접속합니다.

## 폴더 구조

```text
/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  ├─ config.js
│  └─ app.js
├─ assets/
│  ├─ favicon.svg
│  └─ og-image.svg
└─ README.md
```

## 참고

- `reservationUrl`과 `mapUrl`이 기본 주소인 상태에서는 버튼 클릭 시 안내 문구가 표시됩니다.
- 행사 경품, 일정, 연락처 등의 실제 내용은 운영 전 반드시 검수하세요.
- 별도 서버가 없는 정적 페이지이므로 방문자 정보나 예약 정보는 홈페이지 자체에 저장하지 않습니다.
