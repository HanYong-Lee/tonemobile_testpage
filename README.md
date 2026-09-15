# SKT 티원모바일 랜딩페이지 1차 MVP

모바일 고객이 매장 찾기, 휴대폰 재고 검색, 업무처리 목록, 오늘의 특가를 빠르게 확인하는 정적 웹앱입니다.

## 운영 전 바꿀 곳

`dist/assets/config.js`에서 아래 세 주소를 입력합니다.

- `inventoryCsvUrl`: 재고 시트를 웹에 CSV로 게시한 주소
- `storesCsvUrl`: 매장 시트를 웹에 CSV로 게시한 주소
- `analyticsEndpoint`: CTA 기록용 Google Apps Script 웹 앱 주소

이미지는 `dist/images/` 폴더에 아래 파일명으로 넣습니다.

- `cs-list.jpg`
- `today-special1.jpg`
- `today-special2.jpg`
- `today-special3.jpg`

## Google Sheets 열 이름

### inventory

`store, model, storage, color, qty`

### stores

`id, name, address, lat, lng, phone, naver, navertalk, daangn, tworld`

재고 수량은 고객 화면에서 `0 = 품절`, `1~2 = 소진 임박🔥`, `3 이상 = 재고 있어요😊`로 자동 변환됩니다.

## CTA Apps Script 예시

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActive().getSheetByName('cta_log');
  sheet.appendRow([
    new Date(), data.action || '', data.store || '', data.model || '',
    data.storage || '', data.color || '', data.campaign || '',
    data.query || '', data.resultCount ?? ''
  ]);
  return ContentService.createTextOutput('ok');
}
```

웹 앱 배포 시 실행 계정과 접근 권한을 운영 정책에 맞게 설정하세요. 고객 이름, 전화번호, GPS 좌표, IP, 브라우저 식별자는 기록하지 않습니다.
