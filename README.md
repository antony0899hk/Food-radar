# C•E•GO Food Radar V1

第一版目標不是做另一個 OpenRice，而是驗證 Nearby Core：

GPS → 搜尋半徑 → 距離 → 條件篩選 → 排序 → 3–5 個結果

## V1 已有
- Browser GPS
- MapLibre GL
- OpenFreeMap / OpenStreetMap 地圖
- 5 / 10 / 15 分鐘步行半徑
- 預算篩選
- 食物類型篩選
- 營業中 / 一個人 / 快食
- Haversine 距離
- 簡單 ranking
- 3–5 個推薦結果
- 手機版 responsive UI

## 目前用示範資料
`DEMO` array 只是 UI / Engine 驗證用途。

下一步應把資料 provider 換成：
1. FEHD Restaurant Licences
2. FEHD Food Licences (except restaurants)
3. CSDI spatial API
4. Public market / cooked food centre data

## 原則
- 不依賴 Google API 才能運作
- Google / OpenRice 只作後期 enrichment 或 outbound link
- Nearby Core 應重用於 Transport / Food / Coffee / Shopping / Travel
- 新店雷達預留，但不阻礙 MVP
