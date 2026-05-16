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
    id: "kyoto",
    title: "京都古都線",
    mark: "京",
    text: "伏見稻荷、清水寺、二年坂/三年坂、祇園與錦市場人潮都重疊，早出門比排更多點更重要。清水寺周邊坡道多，自駕要優先找外圍停車場。",
    tags: [
      ["必吃美食", "錦市場豆乳甜點、玉子燒、漬物、抹茶點心", "food"],
      ["必點菜單", "伏見稻荷周邊稻荷壽司、烤麻雀/鵪鶉串可視接受度嘗試", "menu"],
      ["必買伴手禮", "八橋、抹茶點心、七味粉、清水燒小物", "gift"],
      ["重要預約代號", "PDF 未提供；住宿與餐廳代號請自行補入工具頁", "reserve"],
    ],
    detail: {
      subtitle: "D1-D2 · 京都市區與東山",
      story: [
        "京都這段的主角不是單一景點，而是從信仰、町家街道到市場飲食的連續體驗。伏見稻荷的千本鳥居代表商業繁盛與稻荷信仰，越往山上走人潮越少，傍晚拍照漂亮但回程要注意照明。",
        "清水寺、二年坂、三年坂與祇園是京都最經典但也最容易塞住的區域。真正的攻略不是多排點，而是早到、少開車進核心區、把午餐和休息點安排在錦市場或京都車站周邊。",
      ],
      route: ["早上先清水寺", "順走二年坂/三年坂", "祇園花見小路短停", "錦市場午餐", "下午金閣寺與下鴨神社"],
      food: ["錦市場玉子燒", "豆乳甜點", "京漬物", "抹茶點心", "伏見稻荷周邊稻荷壽司"],
      shopping: ["八橋", "七味粉", "抹茶零食", "清水燒小物"],
      drive: "東山、祇園、錦市場周邊道路窄、人潮密、停車場容易滿。建議選外圍停車場後步行或搭計程車，清水寺周邊不要臨時找車位。",
      watch: ["清水寺坡道多，推車會辛苦。", "祇園私人巷弄和店家請避免打擾。", "錦市場部分店家不鼓勵邊走邊吃。"],
    },
  },
  {
    id: "wakasa",
    title: "若狹小濱線",
    mark: "若",
    text: "小濱是鯖街道起點之一，海產、鹽與京都飲食文化關聯很深。明通寺與小濱西組適合放慢節奏，若狹漁人碼頭可作為晚餐與伴手禮補給。",
    tags: [
      ["必吃美食", "鯖壽司、若狹甘鯛、小鯛笹漬、海鮮丼", "food"],
      ["必點菜單", "烤鯖、海鮮丼、葛饅頭", "menu"],
      ["必買伴手禮", "鯖壽司、heshiko 鯖魚糠漬、若狹塗箸", "gift"],
      ["重要預約代號", "Party&Resort ZERO'sHOUSE：PDF 未提供代號", "reserve"],
    ],
    detail: {
      subtitle: "D3 · 琵琶湖西岸到若狹小濱",
      story: [
        "若狹小濱是古代把海產送往京都的「鯖街道」起點之一，所以這裡的海鮮不是單純吃新鮮，而是跟京都飲食文化有很深連結。鯖壽司、鯖魚加工品、若狹塗箸都很適合放入伴手禮清單。",
        "這一天從京都山路、琵琶湖湖岸一路進入日本海側，景色變化大，但駕駛負擔也高。白鬚神社湖上鳥居很美，不過旁邊車流速度快，安全比拍照角度重要。",
      ],
      route: ["貴船神社早到", "白鬚神社短停", "琵琶湖兒童之國放電", "明通寺", "若狹漁人碼頭", "小濱老街散步"],
      food: ["鯖壽司", "烤鯖", "海鮮丼", "若狹甘鯛", "葛饅頭"],
      shopping: ["heshiko 鯖魚糠漬", "小鯛笹漬", "若狹塗箸", "海鮮加工品"],
      drive: "貴船山路窄，琵琶湖湖岸道路拍照點容易讓人分心。今天車程長，建議把加油、廁所與兒童休息點固定下來。",
      watch: ["白鬚神社不要穿越車道到湖邊拍照。", "小濱晚餐店家選擇有限，先查營業時間。", "冷藏伴手禮需要保冷袋。"],
    },
  },
  {
    id: "kyoto-sea",
    title: "海之京都線",
    mark: "海",
    text: "天橋立是日本三景之一，傘松公園的股覗き視角是經典。伊根舟屋停車與遊覽船容易受天候影響，出發前先看風雨與末班時間。",
    tags: [
      ["必吃美食", "宮津海鮮、丹後壽司、蛤蜊/魚介料理", "food"],
      ["必點菜單", "海鮮定食、丹後米飯糰、在地清酒", "menu"],
      ["必買伴手禮", "丹波黑豆、栗子點心、海產加工品", "gift"],
      ["重要預約代號", "Private Villa 蒼 Lala & Lino：PDF 未提供代號", "reserve"],
    ],
    detail: {
      subtitle: "D4-D5 · 舞鶴、宮津、天橋立、伊根",
      story: [
        "天橋立是日本三景之一，重點是從高處看沙洲像一座連接天空的橋。傘松公園的股覗き視角是經典玩法，但纜車、吊椅與觀景品質很受天氣影響。",
        "伊根舟屋是海邊生活聚落，不是大型觀光園區。最好把車停在指定停車場後步行，保持安靜，並把遊覽船當成天氣好時的加分項，而不是必達任務。",
      ],
      route: ["舞鶴港海鮮市場早午餐", "宮津道之驛補給", "智恩寺", "傘松公園", "伊根遊覽與舟屋散步", "隔天京丹波道之驛回大阪"],
      food: ["舞鶴海鮮", "宮津海鮮定食", "丹後米", "在地清酒", "丹波黑豆甜點"],
      shopping: ["丹波黑豆", "栗子點心", "海產加工品", "丹後米零食"],
      drive: "海線道路天氣好很舒服，但伊根聚落內道路窄、停車有限。天橋立和伊根都要先決定停車場，不要到現場才繞。",
      watch: ["強風或大雨時遊覽船、摩天輪、展望設施可能受影響。", "伊根舟屋是居民生活區，拍照請保持距離。", "晚間採買選擇少，住宿前先補給。"],
    },
  },
  {
    id: "osaka",
    title: "大阪親子美食線",
    mark: "阪",
    text: "大阪段點位密集，建議用天下茶屋作基地分區移動。新世界吃串炸、道頓堀吃章魚燒與大阪燒，木津市場排早餐最順。",
    tags: [
      ["必吃美食", "章魚燒、大阪燒、串炸、551 蓬萊豬肉包", "food"],
      ["必點菜單", "新世界串炸、道頓堀章魚燒、木津市場海鮮早餐", "menu"],
      ["必買伴手禮", "Pocky 地區限定、呼吸巧克力、551 冷藏品需留意保存", "gift"],
      ["重要預約代號", "USJ、海遊館、觀光船票券代號請補入工具頁", "reserve"],
    ],
    detail: {
      subtitle: "D6-D10 · 大阪市區、港區與 USJ",
      story: [
        "大阪段的價值是密度高：新世界、天王寺、梅田、天神橋筋、道頓堀、港區、USJ 都各有不同節奏。建議把天下茶屋當作基地，依區域行動，不要每天開車穿越市中心。",
        "親子行程的關鍵不是景點多，而是備案清楚。海遊館、Legoland、生活今昔館、商店街、溫泉都是雨天或體力下降時很好用的替代點。",
      ],
      route: ["天王寺動物園與新世界", "大阪城與梅田", "天神橋筋與道頓堀", "木津市場與大阪港", "USJ 整日"],
      food: ["新世界串炸", "道頓堀章魚燒", "大阪燒", "木津市場早餐", "551 蓬萊"],
      shopping: ["呼吸巧克力", "地區限定零食", "藥妝", "USJ 限定商品", "超市熟食"],
      drive: "大阪市區停車費高、路口複雜，除港區與 USJ 外，多數天建議把車留在住宿附近，用電車或計程車移動。",
      watch: ["USJ 不要排其他景點，專注入園和熱門設施。", "泡湯設施需確認刺青、兒童和入館規定。", "道頓堀與心齋橋人潮多，推車移動慢。"],
    },
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

const LOCAL_STATE_KEY = "kansai-trip-state";
const budgetPeople = ["煥", "英", "嘉", "銘", "評", "青"];
const budgetCategories = [
  { id: "food", label: "餐飲", icon: "utensils" },
  { id: "transport", label: "交通/停車", icon: "car-front" },
  { id: "ticket", label: "門票", icon: "ticket" },
  { id: "stay", label: "住宿", icon: "bed" },
  { id: "souvenir", label: "伴手禮", icon: "gift" },
  { id: "market", label: "超市/採買", icon: "shopping-bag" },
  { id: "fuel", label: "加油", icon: "fuel" },
  { id: "other", label: "其他", icon: "wallet" },
];

function createBudgetRow(overrides = {}) {
  return {
    category: "food",
    person: budgetPeople[0],
    item: "",
    amount: "",
    memo: "",
    ...overrides,
  };
}

function normalizeBudgetRow(row = {}) {
  const matchedCategory =
    budgetCategories.find((category) => category.id === row.category) ||
    budgetCategories.find((category) => category.label === row.item) ||
    budgetCategories[0];
  const person = budgetPeople.includes(row.person) ? row.person : budgetPeople[0];

  return createBudgetRow({
    category: matchedCategory.id,
    person,
    item: row.item || matchedCategory.label,
    amount: row.amount ?? "",
    memo: row.memo ?? "",
  });
}

function getDefaultTripState() {
  return {
    checklist: {},
    reservations: reservationItems.map(([item, date, detail, code]) => ({ item, date, detail, code })),
    budget: [
      createBudgetRow({ category: "food", item: "餐飲" }),
      createBudgetRow({ category: "transport", item: "交通/停車" }),
      createBudgetRow({ category: "ticket", item: "門票" }),
      createBudgetRow({ category: "souvenir", item: "伴手禮" }),
    ],
    shopping: {},
  };
}

function readJsonStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function mergeTripState(value = {}) {
  const defaults = getDefaultTripState();
  return {
    checklist: value.checklist && typeof value.checklist === "object" ? value.checklist : defaults.checklist,
    reservations: Array.isArray(value.reservations) ? value.reservations : defaults.reservations,
    budget: Array.isArray(value.budget) ? value.budget.map(normalizeBudgetRow) : defaults.budget,
    shopping: value.shopping && typeof value.shopping === "object" ? value.shopping : defaults.shopping,
  };
}

function loadTripState() {
  const savedState = readJsonStorage(LOCAL_STATE_KEY, null);
  if (savedState) return mergeTripState(savedState);

  return mergeTripState({
    checklist: readJsonStorage("kansai-checklist", {}),
    reservations: readJsonStorage("kansai-reservations", null),
    budget: readJsonStorage("kansai-budget", null),
    shopping: readJsonStorage("kansai-shopping", {}),
  });
}

let tripState = loadTripState();
let syncTimer = null;
let syncInFlight = false;

function persistTripStateLocal() {
  localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(tripState));
  localStorage.setItem("kansai-checklist", JSON.stringify(tripState.checklist));
  localStorage.setItem("kansai-reservations", JSON.stringify(tripState.reservations));
  localStorage.setItem("kansai-budget", JSON.stringify(tripState.budget));
  localStorage.setItem("kansai-shopping", JSON.stringify(tripState.shopping));
}

function setSyncStatus(message, state = "online") {
  const banner = $("#network-status");
  if (!banner) return;
  banner.dataset.syncState = state;
  banner.innerHTML = `<i data-lucide="${state === "offline" ? "wifi-off" : state === "error" ? "cloud-alert" : "cloud-check"}"></i><span>${message}</span>`;
  if (window.lucide) window.lucide.createIcons();
}

function updateTripState(section, value, options = {}) {
  tripState = mergeTripState({ ...tripState, [section]: value });
  persistTripStateLocal();
  if (options.sync !== false) scheduleStateSync();
}

function scheduleStateSync() {
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(syncTripState, 650);
}

async function syncTripState() {
  if (syncInFlight || !navigator.onLine) return;
  syncInFlight = true;
  try {
    const response = await fetch("./api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: tripState }),
    });
    if (!response.ok) throw new Error("sync failed");
    const payload = await response.json();
    tripState = mergeTripState(payload.data);
    persistTripStateLocal();
    setSyncStatus("已同步到 Neon，共用資料為最新。", "online");
  } catch {
    setSyncStatus("目前使用本機資料；部署到 Vercel 並設定 Neon 後會自動同步。", "error");
  } finally {
    syncInFlight = false;
  }
}

async function hydrateSharedState() {
  if (!navigator.onLine) return;
  try {
    const response = await fetch("./api/state", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("state unavailable");
    const payload = await response.json();
    tripState = mergeTripState(payload.data);
    persistTripStateLocal();
    renderTools();
    setupBudget();
    setupChecklist();
    setupReservations();
    setupShoppingList();
    setSyncStatus("已載入 Neon 共用資料。", "online");
    if (window.lucide) window.lucide.createIcons();
  } catch {
    setSyncStatus("目前使用本機資料；部署到 Vercel 並設定 Neon 後會自動同步。", "error");
  }
}

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

function routeUrl(day) {
  const places = day.stops.map(([, name]) => name).filter(Boolean);
  if (places.length < 2) return mapUrl(places[0] ?? day.weather.label);
  const params = new URLSearchParams({
    api: "1",
    origin: `${places[0]} 日本`,
    destination: `${places.at(-1)} 日本`,
    travelmode: "driving",
  });
  const waypoints = places.slice(1, -1).slice(0, 8);
  if (waypoints.length) params.set("waypoints", waypoints.map((place) => `${place} 日本`).join("|"));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function timeToMinutes(time) {
  if (!/^\d{2}:\d{2}$/.test(time)) return null;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function durationText(from, to) {
  const start = timeToMinutes(from);
  const end = timeToMinutes(to);
  if (start === null || end === null || end <= start) return "彈性";
  const diff = end - start;
  if (diff < 60) return `${diff} 分`;
  return `${Math.floor(diff / 60)} 小時${diff % 60 ? ` ${diff % 60} 分` : ""}`;
}

function stopRecord(dayNumber, stopIndex) {
  const day = tripDays.find((item) => item.day === Number(dayNumber));
  if (!day) return null;
  const stop = day.stops[Number(stopIndex)];
  if (!stop) return null;
  const [time, name, type, note] = stop;
  return { day, stop, time, name, type, note, index: Number(stopIndex), next: day.stops[Number(stopIndex) + 1] };
}

function carInfoForStop(record) {
  if (record.type === "hotel") return ["住宿附近停車場", "入住前確認卸行李位置與夜間出入口。", "車機電話以訂房頁/住宿訊息為準"];
  if (record.type === "food") return ["周邊 Times / 市場停車場", "熱門用餐點先查最後點餐時間，市場冷藏品注意保存。", "可用店名搜尋導航"];
  if (record.type === "transport") return ["官方停車/還車入口", "先確認 ETC、加油、還車動線與航廈接駁時間。", "可用地點名搜尋導航"];
  if (record.type === "shopping") return ["商場或店鋪停車場", "採買前確認退稅、冷藏袋與車上空間。", "可用店名搜尋導航"];
  return ["官方/周邊收費停車場", "景點周邊車位熱門，建議先開 Google Maps 看即時滿位與步行距離。", "可用地點名搜尋導航"];
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
          ${renderRouteMap(day)}
          <div class="timeline">
            ${day.stops.map((stop, index) => renderStop(stop, day, index)).join("")}
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

function renderRouteMap(day) {
  const visibleStops = day.stops.slice(0, 6);
  return `
    <section class="route-map" aria-label="第 ${day.day} 天路線地圖">
      <div class="route-map__head">
        <div>
          <p class="kicker">${day.weather.label} route</p>
          <h3>當日 Google Maps 路線</h3>
        </div>
        <span>${day.stops.length} 站</span>
      </div>
      <div class="route-map__canvas" aria-hidden="true">
        <div class="route-map__path"></div>
        ${visibleStops.map(([, name], index) => `<span class="map-pin pin-${index + 1}">${index + 1}<small>${escapeAttr(name)}</small></span>`).join("")}
      </div>
      <a class="route-map__link" href="${routeUrl(day)}" target="_blank" rel="noreferrer">
        <i data-lucide="map"></i>開啟 Google Maps 導航
      </a>
    </section>
  `;
}

function renderStop(stop, day, index) {
  const [time, name, type, note] = stop;
  const meta = typeMeta[type] ?? typeMeta.sight;
  const nextStop = day.stops[index + 1];
  return `
    <article class="stop-card" data-stop-day="${day.day}" data-stop-index="${index}">
      <time class="stop-time">${time}</time>
      <div class="stop-main">
        <span class="stop-type"><i data-lucide="${meta.icon}"></i>${meta.label}</span>
        <strong class="stop-name">${name}</strong>
        <p class="stop-note">${note}</p>
        <div class="stop-actions">
          <a class="nav-link" href="${mapUrl(name)}" target="_blank" rel="noreferrer" data-stop-nav>
            <i data-lucide="navigation"></i>導航
          </a>
          <button class="detail-link" type="button" data-stop-detail><i data-lucide="book-open"></i>攻略</button>
        </div>
      </div>
      <aside class="stop-meta">
        <span><i data-lucide="clock"></i>${nextStop ? nextStop[0] : "收尾"}</span>
        <small>${nextStop ? durationText(time, nextStop[0]) : "完成"}</small>
      </aside>
    </article>
  `;
}

function renderGuide() {
  $("#guide-grid").innerHTML = guideNotes
    .map(
      (note) => `
        <article class="guide-card" data-guide-card="${note.id}">
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
          <button class="mini-button guide-detail-button" data-guide-id="${note.id}" type="button">
            <i data-lucide="book-open"></i>詳細攻略
          </button>
        </article>
      `,
    )
    .join("");
}

function renderGuideDetail(note) {
  const detail = note.detail;
  return `
    <div class="guide-sheet__intro">
      <span class="region-mark">${note.mark}</span>
      <p>${note.text}</p>
    </div>
    <div class="sheet-section">
      <h3><i data-lucide="scroll-text"></i>景點故事</h3>
      ${detail.story.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </div>
    <div class="sheet-section">
      <h3><i data-lucide="route"></i>建議走法</h3>
      <ol class="sheet-steps">
        ${detail.route.map((item) => `<li>${item}</li>`).join("")}
      </ol>
    </div>
    <div class="sheet-section sheet-grid">
      <div>
        <h3><i data-lucide="utensils"></i>必吃美食</h3>
        <div class="sheet-tags">${detail.food.map((item) => `<span class="tag food">${item}</span>`).join("")}</div>
      </div>
      <div>
        <h3><i data-lucide="shopping-bag"></i>必買伴手禮</h3>
        <div class="sheet-tags">${detail.shopping.map((item) => `<span class="tag gift">${item}</span>`).join("")}</div>
      </div>
    </div>
    <div class="sheet-section">
      <h3><i data-lucide="car"></i>自駕攻略</h3>
      <p>${detail.drive}</p>
    </div>
    <div class="sheet-section">
      <h3><i data-lucide="triangle-alert"></i>現場提醒</h3>
      <ul class="sheet-list">
        ${detail.watch.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>
  `;
}

function renderStopDetail(record) {
  const meta = typeMeta[record.type] ?? typeMeta.sight;
  const note = dayContent[record.day.day];
  const [parking, parkingNote, phoneHint] = carInfoForStop(record);
  const nextName = record.next?.[1] ?? "今日收尾";
  const nextTime = record.next?.[0] ?? "完成";
  const tags =
    record.type === "food"
      ? [["必點菜單", "先看招牌、季節限定與兒童可吃品項", "menu"]]
      : record.type === "shopping"
        ? [["必買伴手禮", "限定品、常溫好帶、退稅品優先", "gift"]]
        : [["攻略重點", "停車、拍照、人潮與雨天備案", "reserve"]];

  return `
    <div class="guide-sheet__intro stop-sheet__intro">
      <span class="stop-type"><i data-lucide="${meta.icon}"></i>${meta.label}</span>
      <p>${record.note}</p>
      <div class="sheet-tags">${tags.map(([label, value, type]) => `<span class="tag ${type}">${label}：${value}</span>`).join("")}</div>
    </div>
    <div class="stop-detail-grid">
      <article>
        <span>時間</span>
        <strong>${record.time}</strong>
        <small>下一站 ${nextTime} · ${durationText(record.time, nextTime)}</small>
      </article>
      <article>
        <span>下一站</span>
        <strong>${nextName}</strong>
        <small>行程可依現場排隊與天氣調整。</small>
      </article>
    </div>
    <div class="sheet-section point-box">
      <h3><i data-lucide="map-pinned"></i>自駕資訊</h3>
      <div class="info-row"><span>停車</span><strong>${parking}</strong></div>
      <div class="info-row"><span>車機</span><strong>${phoneHint}</strong></div>
      <p>${parkingNote}</p>
    </div>
    <div class="sheet-section">
      <h3><i data-lucide="sparkles"></i>現場攻略</h3>
      <ul class="sheet-list">
        <li>${note?.focus ?? "依現場營業時間與天候調整停留順序。"}</li>
        <li>${note?.drive ?? "自駕請先確認停車場、步行距離與回程方向。"}</li>
        <li>${note?.rain ?? "雨天保留室內點與用餐備案，戶外點縮短停留。"}</li>
      </ul>
    </div>
    <div class="sheet-actions">
      <a class="mini-button" href="${mapUrl(record.name)}" target="_blank" rel="noreferrer"><i data-lucide="navigation"></i>單點導航</a>
      <a class="mini-button" href="${routeUrl(record.day)}" target="_blank" rel="noreferrer"><i data-lucide="route"></i>今日路線</a>
    </div>
  `;
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
      <p>把航班、租車、住宿和票券代號集中在這裡；部署 Neon 後會與同行成員同步，本機仍會保留備份。</p>
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
        <p>金額會先存在手機，部署 Neon 後會同步成共用記帳表。</p>
        <div class="budget-summary" id="budget-summary"></div>
        <div class="budget-list" id="budget-body"></div>
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

function setupGuideSheet() {
  const sheet = $("#guide-sheet");
  const backdrop = $("#guide-backdrop");
  const closeButton = $("#guide-sheet-close");
  const title = $("#guide-sheet-title");
  const kicker = $("#guide-sheet-kicker");
  const body = $("#guide-sheet-body");

  function openGuide(id) {
    const note = guideNotes.find((item) => item.id === id);
    if (!note) return;
    title.textContent = note.title;
    kicker.textContent = note.detail.subtitle;
    body.innerHTML = renderGuideDetail(note);
    openSheet();
  }

  function openStop(dayNumber, stopIndex) {
    const record = stopRecord(dayNumber, stopIndex);
    if (!record) return;
    title.textContent = record.name;
    kicker.textContent = `Day ${record.day.day} · ${record.time} · ${record.day.area}`;
    body.innerHTML = renderStopDetail(record);
    openSheet();
  }

  function openSheet() {
    sheet.hidden = false;
    backdrop.hidden = false;
    requestAnimationFrame(() => {
      sheet.classList.add("is-open");
      backdrop.classList.add("is-open");
      document.body.classList.add("sheet-open");
      closeButton.focus({ preventScroll: true });
      if (window.lucide) window.lucide.createIcons();
    });
  }

  function closeGuide() {
    sheet.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    document.body.classList.remove("sheet-open");
    window.setTimeout(() => {
      sheet.hidden = true;
      backdrop.hidden = true;
      body.innerHTML = "";
    }, 220);
  }

  $("#guide-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-guide-id]");
    if (button) openGuide(button.dataset.guideId);
  });

  $("#days").addEventListener("click", (event) => {
    if (event.target.closest("[data-stop-nav]")) return;
    const card = event.target.closest("[data-stop-day]");
    if (card) openStop(card.dataset.stopDay, card.dataset.stopIndex);
  });

  $("#days").addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target.closest("[data-stop-nav]")) return;
    const card = event.target.closest("[data-stop-day]");
    if (!card) return;
    event.preventDefault();
    openStop(card.dataset.stopDay, card.dataset.stopIndex);
  });

  closeButton.addEventListener("click", closeGuide);
  backdrop.addEventListener("click", closeGuide);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sheet.classList.contains("is-open")) closeGuide();
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
  const saved = tripState.budget;

  function collectRows() {
    return [...body.querySelectorAll(".budget-entry")].map((row) => ({
      category: row.querySelector('[data-field="category"]').value,
      person: row.querySelector('[data-field="person"]').value,
      item: row.querySelector('[data-field="item"]').value,
      amount: row.querySelector('[data-field="amount"]').value,
      memo: row.querySelector('[data-field="memo"]').value,
    })).map(normalizeBudgetRow);
  }

  function updateTotal(rows = collectRows()) {
    const total = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
    $("#budget-total").textContent = `¥${total.toLocaleString("ja-JP")}`;

    const summary = $("#budget-summary");
    summary.innerHTML = budgetPeople
      .map((person) => {
        const subtotal = rows
          .filter((row) => row.person === person)
          .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
        return `<span class="person-total"><strong>${person}</strong>¥${subtotal.toLocaleString("ja-JP")}</span>`;
      })
      .join("");
  }

  function persist() {
    const rows = collectRows();
    updateTotal(rows);
    updateTripState("budget", rows);
  }

  function refreshEntryIcon(entry) {
    const category = budgetCategories.find((item) => item.id === entry.querySelector('[data-field="category"]').value) ?? budgetCategories[0];
    entry.querySelector(".budget-entry__icon").innerHTML = `<i data-lucide="${category.icon}"></i>`;
    if (window.lucide) window.lucide.createIcons();
  }

  function addRow(row = createBudgetRow()) {
    const normalized = normalizeBudgetRow(row);
    const entry = document.createElement("article");
    entry.className = "budget-entry";
    entry.innerHTML = `
      <div class="budget-entry__icon" aria-hidden="true"><i data-lucide="utensils"></i></div>
      <label>
        <span>分類</span>
        <select name="budget-category" data-field="category" aria-label="分類">
          ${budgetCategories
            .map((category) => `<option value="${category.id}" ${category.id === normalized.category ? "selected" : ""}>${category.label}</option>`)
            .join("")}
        </select>
      </label>
      <label>
        <span>人</span>
        <select name="budget-person" data-field="person" aria-label="付款人">
          ${budgetPeople.map((person) => `<option value="${person}" ${person === normalized.person ? "selected" : ""}>${person}</option>`).join("")}
        </select>
      </label>
      <label class="budget-entry__item">
        <span>項目</span>
        <input name="budget-item" data-field="item" value="${escapeAttr(normalized.item)}" aria-label="項目" />
      </label>
      <label>
        <span>金額 JPY</span>
        <input name="budget-amount" data-field="amount" value="${escapeAttr(normalized.amount)}" inputmode="numeric" pattern="[0-9]*" aria-label="金額" />
      </label>
      <label class="budget-entry__memo">
        <span>備註</span>
        <input name="budget-memo" data-field="memo" value="${escapeAttr(normalized.memo)}" aria-label="備註" />
      </label>
      <button class="icon-button budget-entry__delete" type="button" aria-label="刪除此筆"><i data-lucide="trash-2"></i></button>
    `;
    entry.addEventListener("input", persist);
    entry.addEventListener("change", (event) => {
      if (event.target.matches('[data-field="category"]')) {
        const previous = budgetCategories.find((item) => item.id === entry.dataset.category)?.label;
        const next = budgetCategories.find((item) => item.id === event.target.value) ?? budgetCategories[0];
        const itemInput = entry.querySelector('[data-field="item"]');
        if (!itemInput.value || itemInput.value === previous) itemInput.value = next.label;
        entry.dataset.category = next.id;
        refreshEntryIcon(entry);
      }
      persist();
    });
    entry.querySelector(".budget-entry__delete").addEventListener("click", () => {
      entry.remove();
      persist();
    });
    body.appendChild(entry);
    entry.dataset.category = normalized.category;
    refreshEntryIcon(entry);
  }

  saved.forEach(addRow);
  $("#add-row").addEventListener("click", () => {
    addRow();
    persist();
  });
  updateTotal(saved);
}

function setupReservations() {
  const body = $("#reservation-body");
  const rows = tripState.reservations;

  function persist() {
    const nextRows = [...body.querySelectorAll("tr")].map((row) => ({
      item: row.querySelector('[data-field="item"]').value,
      date: row.querySelector('[data-field="date"]').value,
      detail: row.querySelector('[data-field="detail"]').value,
      code: row.querySelector('[data-field="code"]').value,
    }));
    updateTripState("reservations", nextRows);
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
}

function setupChecklist() {
  const body = $("#checklist");
  const progress = $("#check-progress");
  const saved = tripState.checklist;

  function renderProgress(checked) {
    const done = Object.values(checked).filter(Boolean).length;
    const percent = Math.round((done / checklistItems.length) * 100);
    progress.style.setProperty("--progress", `${percent * 3.6}deg`);
    progress.querySelector("span").textContent = `${percent}%`;
  }

  function persist() {
    const checked = {};
    body.querySelectorAll("input[type='checkbox']").forEach((input) => {
      checked[input.value] = input.checked;
    });
    renderProgress(checked);
    updateTripState("checklist", checked);
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
  renderProgress(saved);
}

function setupShoppingList() {
  const body = $("#shopping-list");
  const progress = $("#shopping-progress");
  const saved = tripState.shopping;

  function renderProgress(checked) {
    const done = Object.values(checked).filter(Boolean).length;
    const percent = Math.round((done / shoppingItems.length) * 100);
    progress.style.setProperty("--progress", `${percent * 3.6}deg`);
    progress.querySelector("span").textContent = `${percent}%`;
  }

  function persist() {
    const checked = {};
    body.querySelectorAll("input[type='checkbox']").forEach((input) => {
      checked[input.value] = input.checked;
    });
    renderProgress(checked);
    updateTripState("shopping", checked);
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
  renderProgress(saved);
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
          hourly: "temperature_2m,weather_code",
          forecast_hours: "6",
          timezone: "Asia/Tokyo",
        });
        const response = await fetch(url);
        if (!response.ok) throw new Error("weather unavailable");
        const data = await response.json();
        const current = data.current;
        const hourly = (data.hourly?.time ?? []).slice(0, 5).map((time, index) => ({
          time: new Date(time).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit", hour12: false }),
          temp: Math.round(data.hourly.temperature_2m[index]),
          code: data.hourly.weather_code[index],
        }));
        target.innerHTML = `
          <div class="weather-current">
            <strong>${Math.round(current.temperature_2m)}°</strong>
            <span>${day.weather.label} · ${weatherCode[current.weather_code] ?? "即時"} · 風 ${Math.round(current.wind_speed_10m)} km/h</span>
          </div>
          <div class="weather-hours">
            ${hourly.map((item) => `<span><small>${item.time}</small><i data-lucide="${item.code >= 61 ? "cloud-rain" : item.code >= 2 ? "cloud-sun" : "sun"}"></i>${item.temp}°</span>`).join("")}
          </div>
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
setupGuideSheet();
setupTodayMode();
setupBudget();
setupChecklist();
setupReservations();
setupShoppingList();
setupNetworkStatus();
hydrateSharedState();
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
