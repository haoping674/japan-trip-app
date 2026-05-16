const tripDays = [
  {
    day: 1,
    date: "2026/09/06",
    area: "關西機場 → 京都市",
    weather: { label: "京都", lat: 35.0116, lon: 135.7681 },
    stops: [
      ["12:40", "關西機場", "transport", "抵達與取車重點。建議先確認 ETC 卡、導航語音、兒童座椅與停車設定。"],
      ["16:21", "RESI STAY cotorune KYOTO", "hotel", "京都住宿基地，先放行李再出發。"],
      ["17:27", "伏見稻荷大社", "sight", "千本鳥居越往山上人越少，傍晚拍照色溫漂亮；山路回程留意照明。"],
      ["18:31", "RESI STAY cotorune KYOTO", "hotel", "回住宿休息。"],
    ],
  },
  {
    day: 2,
    date: "2026/09/07",
    area: "京都府 → 京都市",
    weather: { label: "京都", lat: 35.0116, lon: 135.7681 },
    stops: [
      ["08:00", "RESI STAY cotorune KYOTO", "hotel", "從清水寺方向開始，路線密集，建議早出門。"],
      ["09:11", "清水寺", "sight", "本堂舞台與音羽瀑布是核心；周邊坡道易塞，停車請預留時間。"],
      ["10:11", "二年坂/三年坂", "sight", "傳統街景與伴手禮集中，適合慢走但人潮多。"],
      ["11:13", "祇園花見小路", "sight", "町家街景，請避免打擾私人店家與藝伎通行。"],
      ["11:44", "錦市場", "food", "京都廚房。可吃玉子燒、豆乳甜點、漬物、抹茶點心。"],
      ["12:47", "RESI STAY cotorune KYOTO", "hotel", "午間回住宿調整。"],
      ["13:56", "金閣寺", "sight", "逆光時水面反射強，拍照可站在池畔斜角。"],
      ["16:02", "下鴨神社", "sight", "糺之森清幽，適合作為下午收尾。"],
      ["17:10", "RESI STAY cotorune KYOTO", "hotel", "回住宿。"],
    ],
  },
  {
    day: 3,
    date: "2026/09/08",
    area: "京都 → 高島 → 小濱",
    weather: { label: "小濱", lat: 35.4958, lon: 135.7466 },
    stops: [
      ["08:00", "RESI STAY cotorune KYOTO", "hotel", "今日移動距離長，油量與休息點先確認。"],
      ["09:22", "貴船神社", "sight", "夏季川床文化有名，山路窄，早到較好停車。"],
      ["11:05", "白鬚神社", "sight", "湖上鳥居是重點，請勿穿越車道到湖邊拍照。"],
      ["12:16", "琵琶湖兒童之國公園", "activity", "親子放電點，可作為長途駕駛休息。"],
      ["14:00", "明通寺", "sight", "若狹古寺，三重塔與本堂具有國寶級看點。"],
      ["15:11", "若狹漁人碼頭", "food", "海鮮採買與用餐點，留意營業時間。"],
      ["16:43", "Party&Resort ZERO'sHOUSE", "hotel", "小濱住宿。"],
      ["17:44", "小濱西組重要傳統的建造物群保存地區", "sight", "老街散步，適合黃昏低光拍照。"],
    ],
  },
  {
    day: 4,
    date: "2026/09/09",
    area: "小濱 → 舞鶴 → 天橋立 → 伊根",
    weather: { label: "宮津", lat: 35.5356, lon: 135.1956 },
    stops: [
      ["08:00", "Party&Resort ZERO'sHOUSE", "hotel", "出發前確認北近畿沿海天氣。"],
      ["09:58", "舞鹤港海鲜市场", "food", "海鮮市場，適合安排早午餐與冷藏伴手禮。"],
      ["12:36", "Roadside Station Kyoto by the Sea MIYAZU", "food", "道之驛補給點，可買丹後/宮津特產。"],
      ["13:39", "智恩寺", "sight", "文殊信仰寺院，與天橋立入口可一起走。"],
      ["14:44", "天橋立傘松公園", "sight", "經典股覗き視角，纜車/吊椅時間要先查。"],
      ["16:04", "伊根浦観光案內", "sight", "舟屋聚落資訊點，可確認遊覽船與停車場。"],
      ["17:33", "Private Villa 蒼 Lala & Lino", "hotel", "海邊住宿，晚間採買請提早。"],
    ],
  },
  {
    day: 5,
    date: "2026/09/10",
    area: "京丹後 → 龜岡 → 大阪",
    weather: { label: "大阪", lat: 34.6937, lon: 135.5023 },
    stops: [
      ["08:00", "Private Villa 蒼 Lala & Lino", "hotel", "離開海之京都，往大阪方向移動。"],
      ["10:45", "京丹波マルシェ（道の駅 京丹波 味夢の里）", "food", "道路休息與採買點，黑豆、栗子、丹波食材可留意。"],
      ["12:18", "保津川漂流（保津川遊船）", "activity", "自然景觀活動，受天候與水量影響，建議前一晚確認。"],
      ["13:52", "好市多Costco 京都八幡倉庫店", "shopping", "補貨點，需會員卡。"],
      ["15:23", "Katsuoji", "sight", "勝尾寺達摩與勝運信仰，山路時間要抓寬。"],
      ["17:02", "天下茶屋", "transport", "大阪住宿/交通基地。"],
    ],
  },
  {
    day: 6,
    date: "2026/09/11",
    area: "阿倍野 → 浪速",
    weather: { label: "大阪", lat: 34.6937, lon: 135.5023 },
    stops: [
      ["08:00", "大阪市天王寺動物園", "activity", "親子行程，早上較涼也較好逛。"],
      ["09:30", "通天閣", "sight", "新世界地標，附近串炸店密集。"],
      ["10:33", "天下茶屋", "transport", "返回或轉乘。"],
      ["10:47", "四天王寺", "sight", "日本古寺代表之一，庭園與伽藍可快速瀏覽。"],
      ["12:48", "Harukas 300 Helipad", "sight", "高空展望，天候好時視野更值得。"],
      ["13:51", "天下茶屋", "transport", "回基地。"],
    ],
  },
  {
    day: 7,
    date: "2026/09/12",
    area: "大阪北區 → 中央區",
    weather: { label: "大阪", lat: 34.6937, lon: 135.5023 },
    stops: [
      ["08:00", "大阪城", "sight", "城郭與公園範圍大，帶小孩請抓步行時間。"],
      ["09:30", "大阪城御座船乗船處", "activity", "護城河遊船，熱門時段建議先確認票況。"],
      ["10:02", "大阪天滿宮", "sight", "學問之神信仰，天神橋筋商店街可串接。"],
      ["10:36", "梅田藍天大廈 空中庭園展望台", "sight", "大阪城市視野，晴天與夕景都適合。"],
      ["11:24", "天然溫泉 浪速之湯", "activity", "泡湯休息，注意刺青與兒童規定。"],
    ],
  },
  {
    day: 8,
    date: "2026/09/13",
    area: "大阪北區 → 中央區",
    weather: { label: "大阪", lat: 34.6937, lon: 135.5023 },
    stops: [
      ["08:00", "大阪生活今昔館", "sight", "室內博物館，雨天備案也合適。"],
      ["10:01", "天神橋筋商店街", "shopping", "長商店街，適合小吃、藥妝與日用品。"],
      ["11:02", "扇町公園", "activity", "親子休息點。"],
      ["12:32", "玉出超市 天神橋店", "shopping", "大阪在地超市採買體驗。"],
      ["13:44", "天下茶屋", "transport", "回基地。"],
      ["13:59", "道頓堀水上觀光船", "activity", "水上看固力果與道頓堀招牌，留意班次。"],
      ["15:04", "心齋橋筋商店街", "shopping", "購物主線，人潮多，推車行進較慢。"],
    ],
  },
  {
    day: 9,
    date: "2026/09/14",
    area: "西成 → 港區",
    weather: { label: "大阪", lat: 34.6937, lon: 135.5023 },
    stops: [
      ["08:00", "天下茶屋", "transport", "出發。"],
      ["08:13", "木津市場", "food", "早市海鮮與熟食，適合早餐。"],
      ["09:23", "海遊館", "activity", "大型水族館，親子行程核心。"],
      ["11:53", "帆船型觀光船 聖瑪麗亞號", "activity", "大阪港觀光船，受天氣影響。"],
      ["12:53", "レゴランド", "activity", "親子室內點，可當雨天備案。"],
      ["14:23", "天保山大摩天輪", "sight", "海灣景色，風大時留意營運。"],
      ["15:28", "空庭溫泉", "activity", "溫泉主題設施，建議先查入館規定。"],
    ],
  },
  {
    day: 10,
    date: "2026/09/15",
    area: "大阪府 → 此花區",
    weather: { label: "大阪", lat: 34.6937, lon: 135.5023 },
    stops: [["08:00", "日本環球影城", "activity", "整日主題樂園。提早確認票券、快速通關、入園時間與回程交通。"]],
  },
  {
    day: 11,
    date: "2026/09/16",
    area: "返程日",
    weather: { label: "關西機場", lat: 34.4347, lon: 135.2442 },
    stops: [["--:--", "關西機場", "transport", "PDF 未列詳細時間。建議補上航班號、還車時間與機場集合時間。"]],
  },
];

const typeMeta = {
  sight: { label: "景點", icon: "landmark" },
  food: { label: "餐廳/市場", icon: "utensils" },
  transport: { label: "交通", icon: "route" },
  hotel: { label: "住宿", icon: "bed-double" },
  activity: { label: "活動", icon: "ticket" },
  shopping: { label: "購物", icon: "shopping-bag" },
};

const dayContent = {
  1: {
    focus: "抵達、取車、入住後只排伏見稻荷，今天不要硬塞晚餐名店。",
    drive: "關西機場取車先確認 ETC、保險、兒童座椅與導航語言；京都市區停車以住宿附近停車場為優先。",
    rain: "若班機延誤或下雨，伏見稻荷改成隔天清晨，今天只完成入住與便利商店補給。",
    meal: "機場或京都車站先簡單吃；晚餐以住宿附近拉麵、定食、超市熟食作彈性備案。",
  },
  2: {
    focus: "京都步行量最大的一天，清水寺周邊停車與人潮是關鍵。",
    drive: "清水寺、祇園、錦市場一帶不建議臨時找路邊停車；先選外圍停車場，再用步行或計程車串點。",
    rain: "清水寺保留，二年坂/三年坂縮短；增加京都車站、錦市場、百貨地下街作室內備案。",
    meal: "午餐以錦市場小吃為主；熱門店請前一天查公休日與最後點餐時間。",
  },
  3: {
    focus: "今天移動長，湖西到若狹請把油量、休息與日落時間抓寬。",
    drive: "貴船山路窄、白鬚神社旁車流快；白鬚神社拍鳥居不要穿越車道，停車後走指定動線。",
    rain: "雨大時減少白鬚神社停留，把時間留給若狹漁人碼頭、住宿休息與小濱室內餐廳。",
    meal: "若狹段主打鯖壽司、海鮮丼、烤鯖；小濱店家晚餐選擇有限，建議先查營業時間。",
  },
  4: {
    focus: "海之京都吃天氣，傘松公園與伊根舟屋都要先看風雨。",
    drive: "天橋立與伊根停車場熱門時段容易滿；伊根聚落內道路窄，依官方停車場與步行動線移動。",
    rain: "若風雨大，傘松公園與遊覽船可改成智恩寺、道之驛、宮津市區咖啡或提早入住。",
    meal: "舞鶴港海鮮市場與宮津道之驛適合安排早午餐；冷藏伴手禮先確認車上保存方式。",
  },
  5: {
    focus: "從海邊回大阪，重點是保津川活動是否受天候影響。",
    drive: "山路與高速混合，先確認保津川遊船營運；大阪入城前完成加油與休息。",
    rain: "保津川若停航，改成京丹波道之驛、勝尾寺短停或直接進大阪採買休息。",
    meal: "京丹波道之驛適合補給黑豆、栗子與簡餐；Costco 需要會員卡與冷藏袋。",
  },
  6: {
    focus: "天王寺、新世界、阿倍野都在市區，今天以短距離移動和親子節奏為主。",
    drive: "大阪市區停車費高且路口複雜，若住宿附近有車位，建議今天改用電車/計程車。",
    rain: "動物園遇雨可縮短，改去阿倍野 Harukas、商場、四天王寺周邊室內用餐。",
    meal: "新世界串炸可作午餐候選；親子同行請避開排隊過久的店，準備第二選項。",
  },
  7: {
    focus: "大阪城與梅田視野日，熱門設施票券和泡湯規定要先確認。",
    drive: "大阪城公園範圍大，若開車請先決定停車場入口；梅田不建議臨停找車位。",
    rain: "大阪城御座船受天氣影響，雨天改大阪生活今昔館、梅田商場或天然溫泉。",
    meal: "天神橋筋、梅田地下街選擇多；避開尖峰用餐，保留泡湯前後補水時間。",
  },
  8: {
    focus: "商店街與道頓堀日，購物多，行李與推車動線要簡化。",
    drive: "今天大多在市區密集區，建議公共交通；若自駕，把車停固定點後步行。",
    rain: "生活今昔館、天神橋筋商店街、心齋橋筋都可避雨；道頓堀船視天候調整。",
    meal: "章魚燒、大阪燒、超市熟食都在這天順路；玉出超市適合買飲料與零食。",
  },
  9: {
    focus: "大阪港親子日，海遊館與聖瑪麗亞號是主線，下午泡湯放鬆。",
    drive: "港區停車比市中心友善，但熱門假日仍要早到；空庭溫泉停車與入館規定先查。",
    rain: "雨天保留海遊館、Legoland、空庭溫泉；聖瑪麗亞號與摩天輪視風雨取消。",
    meal: "木津市場適合早餐；港區午餐以商場餐廳為備案，避免孩子餓太久。",
  },
  10: {
    focus: "USJ 整日，不排其他點，所有精力放在入園、熱門設施與回程。",
    drive: "若自駕去 USJ，停車場費用與入場動線先查；更穩的是電車到 Universal City。",
    rain: "雨天仍可玩，但備雨衣、防水鞋袋；戶外設施可能暫停，改排室內設施與表演。",
    meal: "園內餐廳尖峰排隊長，先決定午餐區域；可準備小點心但遵守園區規定。",
  },
  11: {
    focus: "返程日只做還車、整理行李、機場報到，不排新景點。",
    drive: "還車時間要抓寬，預留加油、找還車入口、接駁與國際線報到時間。",
    rain: "雨天把行李裝卸與還車時間再加 30 分鐘；機場內購物即可。",
    meal: "關西機場內完成最後採買與用餐；液體、冷藏品與手提限制先確認。",
  },
};

const guideNotes = [
  {
    title: "京都古都線",
    mark: "京",
    text: "伏見稻荷、清水寺、二年坂/三年坂、祇園與錦市場人潮都重疊，早出門比排更多點更重要。清水寺周邊坡道多，自駕要優先找外圍停車場。",
    tags: [
      ["必吃美食", "錦市場豆乳甜點、玉子燒、漬物、抹茶點心", "food"],
      ["必點菜單", "伏見稻荷周邊稻荷壽司、烤麻雀/鵪鶉串可視接受度嘗試", "menu"],
      ["必買伴手禮", "八橋、抹茶點心、七味粉、清水燒小物", "gift"],
      ["重要預約代號", "PDF 未提供；住宿與餐廳代號請自行補入工具頁", "reserve"],
    ],
  },
  {
    title: "若狹小濱線",
    mark: "若",
    text: "小濱是鯖街道起點之一，海產、鹽與京都飲食文化關聯很深。明通寺與小濱西組適合放慢節奏，若狹漁人碼頭可作為晚餐與伴手禮補給。",
    tags: [
      ["必吃美食", "鯖壽司、若狹甘鯛、小鯛笹漬、海鮮丼", "food"],
      ["必點菜單", "烤鯖、海鮮丼、葛饅頭", "menu"],
      ["必買伴手禮", "鯖壽司、heshiko 鯖魚糠漬、若狹塗箸", "gift"],
      ["重要預約代號", "Party&Resort ZERO'sHOUSE：PDF 未提供代號", "reserve"],
    ],
  },
  {
    title: "海之京都線",
    mark: "海",
    text: "天橋立是日本三景之一，傘松公園的股覗き視角是經典。伊根舟屋停車與遊覽船容易受天候影響，出發前先看風雨與末班時間。",
    tags: [
      ["必吃美食", "宮津海鮮、丹後壽司、蛤蜊/魚介料理", "food"],
      ["必點菜單", "海鮮定食、丹後米飯糰、在地清酒", "menu"],
      ["必買伴手禮", "丹波黑豆、栗子點心、海產加工品", "gift"],
      ["重要預約代號", "Private Villa 蒼 Lala & Lino：PDF 未提供代號", "reserve"],
    ],
  },
  {
    title: "大阪親子美食線",
    mark: "阪",
    text: "大阪段點位密集，建議用天下茶屋作基地分區移動。新世界吃串炸、道頓堀吃章魚燒與大阪燒，木津市場排早餐最順。",
    tags: [
      ["必吃美食", "章魚燒、大阪燒、串炸、551 蓬萊豬肉包", "food"],
      ["必點菜單", "新世界串炸、道頓堀章魚燒、木津市場海鮮早餐", "menu"],
      ["必買伴手禮", "Pocky 地區限定、呼吸巧克力、551 冷藏品需留意保存", "gift"],
      ["重要預約代號", "USJ、海遊館、觀光船票券代號請補入工具頁", "reserve"],
    ],
  },
];

const tools = [
  {
    title: "航班資訊",
    rows: [
      ["抵達", "2026/09/06 12:40 關西機場"],
      ["返程", "2026/09/16 PDF 未提供航班時間"],
      ["自駕提醒", "取車時確認 ETC、保險、還車油量、MapCode/電話導航。"],
    ],
  },
  {
    title: "住宿資訊",
    rows: [
      ["京都", "RESI STAY cotorune KYOTO"],
      ["小濱", "Party&Resort ZERO'sHOUSE"],
      ["伊根/宮津", "Private Villa 蒼 Lala & Lino"],
      ["大阪", "天下茶屋周邊住宿/基地，PDF 未列正式飯店名。"],
    ],
  },
  {
    title: "緊急聯絡電話",
    rows: [
      ["警察", "110"],
      ["消防/救護", "119"],
      ["海上保安廳", "118"],
      ["台灣日本關西急難", "請補入駐大阪辦事處與保險公司電話。"],
    ],
  },
];

const checklistItems = [
  ["passport", "護照與護照影本", "確認效期、手機內存一份照片。"],
  ["license", "台灣駕照、日文譯本、租車預約", "自駕必備，取車時一起出示。"],
  ["tickets", "電子票券與預約 QR code", "USJ、海遊館、觀光船、住宿、溫泉。"],
  ["insurance", "旅平險與租車保險資料", "把保單號碼和緊急電話放在工具頁。"],
  ["cash", "日圓現金與信用卡", "鄉下道之驛、停車場、老店可能偏好現金。"],
  ["mobile", "eSIM / Wi-Fi / 行動電源", "導航與天氣需要網路，行動電源放隨身包。"],
  ["medicine", "常備藥、兒童用品、雨具", "山區與海邊天氣變化快。"],
  ["offline", "離線開啟一次 App", "出發前用手機開一次，讓 PWA 快取行程。"],
];

const reservationItems = [
  ["航班去程", "2026/09/06", "關西機場抵達 12:40", ""],
  ["航班回程", "2026/09/16", "請補航班號、起飛時間、航廈", ""],
  ["租車", "09/06 - 09/16", "取還車地點、保險、ETC、車型", ""],
  ["京都住宿", "09/06 - 09/08", "RESI STAY cotorune KYOTO", ""],
  ["小濱住宿", "09/08 - 09/09", "Party&Resort ZERO'sHOUSE", ""],
  ["伊根/宮津住宿", "09/09 - 09/10", "Private Villa 蒼 Lala & Lino", ""],
  ["大阪住宿", "09/10 - 09/16", "天下茶屋周邊住宿名與地址", ""],
  ["USJ", "2026/09/15", "門票、快速通關、入園 QR", ""],
  ["海遊館/觀光船", "2026/09/14", "海遊館、聖瑪麗亞號、Legoland", ""],
];

const shoppingItems = [
  ["yatsuhashi", "京都八橋 / 抹茶點心", "京都", "常溫好帶，適合分送。"],
  ["shichimi", "七味粉 / 京漬物", "京都", "漬物注意冷藏與入境限制。"],
  ["kiyomizu", "清水燒小物", "清水寺周邊", "易碎品用衣物包覆。"],
  ["saba", "鯖壽司 / heshiko", "若狹小濱", "冷藏保存，回台限制需自行確認。"],
  ["wakasa", "若狹塗箸", "小濱", "輕巧耐帶，適合長輩。"],
  ["tango", "丹波黑豆 / 栗子點心", "京丹波道之驛", "道之驛適合一次補貨。"],
  ["osaka-snack", "呼吸巧克力 / 地區限定零食", "大阪", "超市、藥妝、車站都好買。"],
  ["551", "551 蓬萊", "大阪", "冷藏品注意保存與攜帶時間。"],
  ["usj", "USJ 限定商品", "USJ", "入園後先看寄物與退稅動線。"],
];

const weatherCode = {
  0: "晴朗",
  1: "大致晴朗",
  2: "局部多雲",
  3: "陰天",
  45: "有霧",
  48: "霧凇",
  51: "毛毛雨",
  53: "毛毛雨",
  55: "毛毛雨",
  61: "小雨",
  63: "降雨",
  65: "大雨",
  80: "陣雨",
  81: "陣雨",
  82: "強陣雨",
  95: "雷雨",
};

const $ = (selector) => document.querySelector(selector);

function mapUrl(place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place} 日本`)}`;
}

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderDays() {
  const dayStrip = $("#day-strip");
  const days = $("#days");
  const focusDay = getTripDayForToday();
  dayStrip.innerHTML = tripDays
    .map(
      (day) =>
        `<a class="day-pill ${day.day === focusDay.day ? "is-today" : ""}" href="#day-${day.day}">D${day.day}<small>${day.date.slice(5)}</small></a>`,
    )
    .join("");

  days.innerHTML = tripDays
    .map(
      (day) => `
        <article class="day-card ${day.day === focusDay.day ? "is-today" : ""}" id="day-${day.day}">
          <header class="day-head">
            <div class="day-title-row">
              <div>
                <p class="kicker">${day.date}</p>
                <h2>第 ${day.day} 天</h2>
                <p class="route">${day.area}</p>
              </div>
              <div class="weather" data-weather="${day.day}">
                <strong>--°</strong>
                <span>${day.weather.label} 即時天氣</span>
              </div>
            </div>
          </header>
          ${renderDayNotes(day.day)}
          <div class="timeline">
            ${day.stops.map(renderStop).join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderDayNotes(dayNumber) {
  const note = dayContent[dayNumber];
  if (!note) return "";

  const items = [
    ["今日重點", note.focus, "flag"],
    ["自駕停車", note.drive, "car"],
    ["雨天備案", note.rain, "cloud-rain"],
    ["用餐提醒", note.meal, "utensils"],
  ];

  return `
    <section class="day-insights" aria-label="第 ${dayNumber} 天提醒">
      ${items
        .map(
          ([label, text, icon]) => `
            <article class="insight-card">
              <span><i data-lucide="${icon}"></i>${label}</span>
              <p>${text}</p>
            </article>
          `,
        )
        .join("")}
    </section>
  `;
}

function renderStop(stop) {
  const [time, name, type, note] = stop;
  const meta = typeMeta[type] ?? typeMeta.sight;
  return `
    <article class="stop-card">
      <time class="stop-time">${time}</time>
      <div class="stop-main">
        <span class="stop-type"><i data-lucide="${meta.icon}"></i>${meta.label}</span>
        <strong class="stop-name">${name}</strong>
        <p class="stop-note">${note}</p>
        <a class="nav-link" href="${mapUrl(name)}" target="_blank" rel="noreferrer">
          <i data-lucide="navigation"></i>導航
        </a>
      </div>
    </article>
  `;
}

function renderGuide() {
  $("#guide-grid").innerHTML = guideNotes
    .map(
      (note) => `
        <article class="guide-card">
          <div class="guide-card__top">
            <h3>${note.title}</h3>
            <span class="region-mark">${note.mark}</span>
          </div>
          <p>${note.text}</p>
          <div class="card-tags">
            ${note.tags
              .map(([label, value, type]) => `<span class="tag ${type}">${label}：${value}</span>`)
              .join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderTools() {
  const checklist = `
    <article class="tool-card checklist-card">
      <div class="checklist-head">
        <div>
          <p class="kicker">Before Departure</p>
          <h3>行前檢查清單</h3>
        </div>
        <div class="progress-ring" id="check-progress" style="--progress: 0deg"><span>0%</span></div>
      </div>
      <div class="checklist" id="checklist"></div>
    </article>
  `;
  const cards = tools
    .map(
      (tool) => `
        <article class="tool-card">
          <h3>${tool.title}</h3>
          <div class="info-list">
            ${tool.rows.map(([label, value]) => `<div class="info-row"><span>${label}</span><strong>${value}</strong></div>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");
  const reservations = `
    <article class="tool-card reservation-card">
      <h3>預約代號表</h3>
      <p>把航班、租車、住宿和票券代號集中在這裡；內容只存在此裝置瀏覽器。</p>
      <div class="responsive-table">
        <table class="budget-table">
          <thead>
            <tr><th>項目</th><th>日期</th><th>內容</th><th>代號</th></tr>
          </thead>
          <tbody id="reservation-body"></tbody>
        </table>
      </div>
    </article>
  `;
  const shopping = `
    <article class="tool-card shopping-card">
      <div class="checklist-head">
        <div>
          <p class="kicker">Souvenir Run</p>
          <h3>伴手禮採買清單</h3>
        </div>
        <div class="progress-ring" id="shopping-progress" style="--progress: 0deg"><span>0%</span></div>
      </div>
      <div class="checklist shopping-list" id="shopping-list"></div>
    </article>
  `;

  $("#tool-stack").innerHTML =
    checklist +
    cards +
    reservations +
    shopping +
    `
      <article class="tool-card budget">
        <h3>記帳 / 預算表</h3>
        <p>金額會存在此裝置瀏覽器，適合旅途中快速記錄日圓支出。</p>
        <table class="budget-table">
          <thead>
            <tr><th>項目</th><th>金額 JPY</th><th>備註</th></tr>
          </thead>
          <tbody id="budget-body"></tbody>
        </table>
        <button class="mini-button" id="add-row" type="button"><i data-lucide="plus"></i>新增一列</button>
        <div class="total-box"><span>目前合計</span><span id="budget-total">¥0</span></div>
      </article>
    `;
}

function switchTab(tabId) {
  document.querySelectorAll(".tab-button").forEach((item) => item.classList.toggle("is-active", item.dataset.tab === tabId));
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("is-active", panel.id === tabId));
}

function setupTabs() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      switchTab(button.dataset.tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function parseTripDate(dateText) {
  const [year, month, day] = dateText.split("/").map(Number);
  return new Date(year, month - 1, day);
}

function getTripDayForToday(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = tripDays.map((day) => ({ ...day, jsDate: parseTripDate(day.date) }));
  const exact = days.find((day) => day.jsDate.getTime() === today.getTime());
  if (exact) return { ...exact, mode: "today" };

  const upcoming = days.find((day) => day.jsDate > today);
  if (upcoming) return { ...upcoming, mode: "upcoming" };

  return { ...days.at(-1), mode: "past" };
}

function focusTripDay(dayNumber, behavior = "smooth") {
  switchTab("itinerary");
  document.getElementById(`day-${dayNumber}`)?.scrollIntoView({ behavior, block: "start" });
}

function setupTodayMode() {
  const target = getTripDayForToday();
  const panel = $("#today-panel");
  const label =
    target.mode === "today"
      ? `今天是第 ${target.day} 天`
      : target.mode === "upcoming"
        ? `下一個行程：第 ${target.day} 天`
        : `旅程已結束，最後一天`;
  const subcopy =
    target.mode === "today"
      ? `${target.date} · ${target.area}`
      : target.mode === "upcoming"
        ? `現在還沒到旅程日期，先定位到 ${target.date}`
        : `${target.date} · 可回看返程資訊`;

  panel.innerHTML = `
    <div class="today-panel__copy">
      <i data-lucide="calendar-check"></i>
      <div>
        <strong>${label}</strong>
        <span>${subcopy}</span>
      </div>
    </div>
    <button class="mini-button" id="jump-today" type="button"><i data-lucide="locate-fixed"></i>定位</button>
  `;
  $("#jump-today").addEventListener("click", () => focusTripDay(target.day));

  if (target.mode === "today" && !location.hash) {
    setTimeout(() => focusTripDay(target.day, "auto"), 250);
  }
}

function setupBudget() {
  const body = $("#budget-body");
  const saved = JSON.parse(localStorage.getItem("kansai-budget") || "null") ?? [
    { item: "餐飲", amount: "", memo: "" },
    { item: "交通/停車", amount: "", memo: "" },
    { item: "門票", amount: "", memo: "" },
    { item: "伴手禮", amount: "", memo: "" },
  ];

  function persist() {
    const rows = [...body.querySelectorAll("tr")].map((row) => ({
      item: row.querySelector('[data-field="item"]').value,
      amount: row.querySelector('[data-field="amount"]').value,
      memo: row.querySelector('[data-field="memo"]').value,
    }));
    localStorage.setItem("kansai-budget", JSON.stringify(rows));
    const total = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
    $("#budget-total").textContent = `¥${total.toLocaleString("ja-JP")}`;
  }

  function addRow(row = { item: "", amount: "", memo: "" }) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input name="budget-item" data-field="item" value="${escapeAttr(row.item)}" aria-label="項目" /></td>
      <td><input name="budget-amount" data-field="amount" value="${escapeAttr(row.amount)}" inputmode="numeric" aria-label="金額" /></td>
      <td><input name="budget-memo" data-field="memo" value="${escapeAttr(row.memo)}" aria-label="備註" /></td>
    `;
    tr.addEventListener("input", persist);
    body.appendChild(tr);
  }

  saved.forEach(addRow);
  $("#add-row").addEventListener("click", () => {
    addRow();
    persist();
  });
  persist();
}

function setupReservations() {
  const body = $("#reservation-body");
  const saved = JSON.parse(localStorage.getItem("kansai-reservations") || "null");
  const rows = saved ?? reservationItems.map(([item, date, detail, code]) => ({ item, date, detail, code }));

  function persist() {
    const nextRows = [...body.querySelectorAll("tr")].map((row) => ({
      item: row.querySelector('[data-field="item"]').value,
      date: row.querySelector('[data-field="date"]').value,
      detail: row.querySelector('[data-field="detail"]').value,
      code: row.querySelector('[data-field="code"]').value,
    }));
    localStorage.setItem("kansai-reservations", JSON.stringify(nextRows));
  }

  body.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td><input name="reservation-item" data-field="item" value="${escapeAttr(row.item)}" aria-label="預約項目" /></td>
          <td><input name="reservation-date" data-field="date" value="${escapeAttr(row.date)}" aria-label="日期" /></td>
          <td><input name="reservation-detail" data-field="detail" value="${escapeAttr(row.detail)}" aria-label="內容" /></td>
          <td><input name="reservation-code" data-field="code" value="${escapeAttr(row.code)}" aria-label="代號" placeholder="填入代號" /></td>
        </tr>
      `,
    )
    .join("");
  body.addEventListener("input", persist);
  persist();
}

function setupChecklist() {
  const body = $("#checklist");
  const progress = $("#check-progress");
  const saved = JSON.parse(localStorage.getItem("kansai-checklist") || "{}");

  function persist() {
    const checked = {};
    body.querySelectorAll("input[type='checkbox']").forEach((input) => {
      checked[input.value] = input.checked;
    });
    localStorage.setItem("kansai-checklist", JSON.stringify(checked));
    const done = Object.values(checked).filter(Boolean).length;
    const percent = Math.round((done / checklistItems.length) * 100);
    progress.style.setProperty("--progress", `${percent * 3.6}deg`);
    progress.querySelector("span").textContent = `${percent}%`;
  }

  body.innerHTML = checklistItems
    .map(
      ([id, title, note]) => `
        <label class="check-item">
          <input name="trip-checklist" type="checkbox" value="${id}" ${saved[id] ? "checked" : ""} />
          <div><strong>${title}</strong><span>${note}</span></div>
        </label>
      `,
    )
    .join("");
  body.addEventListener("change", persist);
  persist();
}

function setupShoppingList() {
  const body = $("#shopping-list");
  const progress = $("#shopping-progress");
  const saved = JSON.parse(localStorage.getItem("kansai-shopping") || "{}");

  function persist() {
    const checked = {};
    body.querySelectorAll("input[type='checkbox']").forEach((input) => {
      checked[input.value] = input.checked;
    });
    localStorage.setItem("kansai-shopping", JSON.stringify(checked));
    const done = Object.values(checked).filter(Boolean).length;
    const percent = Math.round((done / shoppingItems.length) * 100);
    progress.style.setProperty("--progress", `${percent * 3.6}deg`);
    progress.querySelector("span").textContent = `${percent}%`;
  }

  body.innerHTML = shoppingItems
    .map(
      ([id, title, place, note]) => `
        <label class="check-item">
          <input name="souvenir-checklist" type="checkbox" value="${id}" ${saved[id] ? "checked" : ""} />
          <div>
            <strong>${title}</strong>
            <span>${place} · ${note}</span>
          </div>
        </label>
      `,
    )
    .join("");
  body.addEventListener("change", persist);
  persist();
}

function setupNetworkStatus() {
  const banner = $("#network-status");

  function render() {
    const online = navigator.onLine;
    banner.classList.toggle("is-offline", !online);
    banner.innerHTML = online
      ? `<i data-lucide="wifi"></i><span>線上模式，天氣與導航可即時更新。</span>`
      : `<i data-lucide="wifi-off"></i><span>離線模式：已快取行程、工具與記帳；天氣和外部導航需等恢復網路。</span>`;
    if (window.lucide) window.lucide.createIcons();
  }

  window.addEventListener("online", render);
  window.addEventListener("offline", render);
  render();
}

async function loadWeather() {
  await Promise.all(
    tripDays.map(async (day) => {
      const target = document.querySelector(`[data-weather="${day.day}"]`);
      try {
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.search = new URLSearchParams({
          latitude: day.weather.lat,
          longitude: day.weather.lon,
          current: "temperature_2m,weather_code,wind_speed_10m",
          timezone: "Asia/Tokyo",
        });
        const response = await fetch(url);
        if (!response.ok) throw new Error("weather unavailable");
        const data = await response.json();
        const current = data.current;
        target.innerHTML = `
          <strong>${Math.round(current.temperature_2m)}°</strong>
          <span>${day.weather.label} · ${weatherCode[current.weather_code] ?? "即時"} · 風 ${Math.round(current.wind_speed_10m)} km/h</span>
        `;
      } catch {
        target.innerHTML = `<strong>--°</strong><span>${day.weather.label} 天氣暫不可用</span>`;
      }
    }),
  );
}

renderDays();
renderGuide();
renderTools();
setupTabs();
setupTodayMode();
setupBudget();
setupChecklist();
setupReservations();
setupShoppingList();
setupNetworkStatus();
loadWeather();

if (window.lucide) {
  window.lucide.createIcons();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The app still works without offline support.
    });
  });
}
