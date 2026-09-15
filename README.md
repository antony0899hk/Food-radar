# C•E•GO Food Radar

目標不是做另一個 OpenRice，而是建立一個可跨國重用、愈用愈完整的 Nearby Food Core：

GPS → 50m 起步 → 資料合併 → 營業狀態 → 距離/條件 → 排序 → 3–5 個有用結果

## Data foundation V0.2

CEGO 使用自己的 provider-agnostic master schema；外部來源只負責提供或驗證欄位，每個重要欄位保留 source / verified time。

永久 Base 優先：
1. Foursquare Open Source Places — 全球 POI base（Apache-2.0，須保留 licence/NOTICE attribution）
2. OpenStreetMap — 全球 POI / opening-hours 補充（按 ODbL 要求使用）
3. Country Provider — 香港 FEHD/CSDI；之後韓國、台灣等加入當地官方/本地來源
4. CEGO verified data — 自家核實及逐步累積

付費或有保存限制的 API 不因為查到資料就自動寫入永久 Base；只按該來源實際授權使用。

## Venue Hours Layer

營業時間優先次序：

`Shop Hours > Food Court Hours > Mall/Market/Night-Market Venue Hours > 未有提供`

Venue Hours 只代表場地時間，不等於確認個別店舖營業。支援：
- mall
- food_court
- traditional_market
- cooked_food_centre
- night_market
- transport_hub
- 24h_venue

夜市支援跨午夜時段，例如 `18:00–02:00`。

## Core rules
- 缺營業時間仍保留店舖，顯示「營業時間未有提供」
- 個別店舖時間永遠 override 場地時間
- 場地開放只表示「有機會營業」，不是確認店舖 open-now
- 已知場地關閉時，沒有獨立入口的未知時間店舖可在 ranking 降權
- Core 不硬編碼香港；國家差異放 provider
- Foursquare OS / OSM / FEHD 等資料先 normalize 再入 CEGO DB
- 搜尋過的地區應逐步減少外部 request，而不是每次重新抓全部資料

## Existing MVP
- Browser GPS
- MapLibre GL + OpenFreeMap / OpenStreetMap
- Haversine 距離
- 預算 / 食物類型 / 營業中 / 一個人 / 快食篩選
- ranking 與手機版 UI

## Next
1. FEHD XML shop-sign join
2. Foursquare OS country/category importer（先 HK，之後 KR/TW）
3. OSM cache/sync
4. dedupe + field-level merge
5. Venue membership matching
6. local open-now calculation
7. ranking / progressive 50→100→200m expansion
