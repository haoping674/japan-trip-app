(function (root, factory) {
  const plans = factory();
  if (typeof module === "object" && module.exports) module.exports = plans;
  if (root) root.RAINY_PLANS = plans;
})(typeof window !== "undefined" ? window : null, function () {
  return {
    1: {
      title: "京都車站室內暖身",
      summary: "抵達日不硬走濕滑山路，先吃飯、補齊雨具，再回住宿休息。",
      trigger: "抵達後仍持續降雨，或入境／取車比預計晚 1 小時以上時啟用。",
      stops: [
        { time: "17:30", place: "京都車站大樓", note: "在室內逛伴手禮與車站空間，先把旅途節奏慢下來。" },
        { time: "18:15", place: "京都 Porta 地下街", note: "晚餐、採買雨具與隔天早餐；避免拖著疲累身體趕伏見山路。" },
        { time: "19:30", place: "Guest House Kyoan", note: "提早回住宿整理行李；伏見稻荷留待天氣穩定時再評估。" },
      ],
      sources: [
        { label: "京都車站大樓", url: "https://www.kyoto-station-building.co.jp/" },
      ],
    },
    2: {
      title: "千手觀音與京都街屋",
      summary: "用有屋頂的寺院、商店街與鐵道博物館串成完整京都室內日。",
      trigger: "上午雨勢中等以上，石坂路面濕滑或不適合長時間拍照時啟用。",
      stops: [
        { time: "08:00", place: "三十三間堂", note: "主殿長廊以室內參觀為主，早到也能避開人潮。" },
        { time: "10:00", place: "錦市場", note: "在有頂棚的市場吃早午餐，留意尖峰時段人潮。" },
        { time: "11:30", place: "新京極商店街", note: "沿新京極、寺町通的拱廊散步購物，把戶外移動壓到最低。" },
        { time: "14:15", place: "京都鐵道博物館", note: "保留原定重點，建議待到 16:30 左右再離館。" },
      ],
      sources: [
        { label: "京都官方雨天建議", url: "https://global.kyoto.travel/en/faq/detail.php?faq_id=1019" },
        { label: "京都鐵道博物館", url: "https://www.kyotorailwaymuseum.jp/en/" },
      ],
    },
    3: {
      title: "把琵琶湖搬進博物館",
      summary: "取消湖畔鳥居與公園野餐，改看淡水水族、生態與若狹食文化。",
      trigger: "湖西持續降雨、風浪大或不適合在兒童公園停留時啟用。",
      stops: [
        { time: "09:30", place: "滋賀縣立琵琶湖博物館", note: "室內看古代湖、生態與大型淡水水族展示；9/8 確認非休館日。" },
        { time: "12:00", place: "琵琶湖博物館餐廳", note: "在館內吃午餐後再開車前往小濱，避免雨中野餐。" },
        { time: "15:30", place: "御食國若狹小濱食文化館", note: "免費看鯖街道與若狹飲食史；若要做筷子研磨等體驗，先確認現場受理。" },
        { time: "17:15", place: "Party&Resort ZERO'sHOUSE", note: "完成室內參觀後入住，不再安排濕滑老街散步。" },
      ],
      sources: [
        { label: "琵琶湖博物館", url: "https://www.biwahaku.jp/english/guide-e/index.html" },
        { label: "若狹小濱食文化館", url: "https://wakasa-obama.jp/spot/miketukuni-syokubunkakan/" },
      ],
    },
    4: {
      title: "舞鶴紅磚室內散策",
      summary: "海岸風雨大時放棄伊根與展望台，留在舞鶴看港都歷史，再提早入住。",
      trigger: "海岸有強風、豪雨或傘松公園視野不佳時啟用；不要為了打卡硬開海岸線。",
      stops: [
        { time: "09:45", place: "道之驛 舞鶴港海鮮市場", note: "照原計畫吃海鮮早午餐，也能在室內補給。" },
        { time: "11:15", place: "舞鶴市立赤煉瓦博物館", note: "看紅磚建築與世界磚材展示；9/9 並非年末休館期。" },
        { time: "13:00", place: "舞鶴赤煉瓦公園", note: "以智惠藏等室內展區為主；雨小再短暫看倉庫外觀。" },
        { time: "15:30", place: "KYOTO TANGO MIYAZU inn", note: "提早入住休息，再到宮津市區室內採買晚餐。" },
      ],
      sources: [
        { label: "舞鶴紅磚博物館", url: "https://maizuru-kanko.net/archives/sightseeing/570" },
        { label: "舞鶴官方觀光資料", url: "https://maizuru-kanko.net/red" },
      ],
    },
    5: {
      title: "北大阪生物美術館",
      summary: "順著回大阪的方向進 NIFREL 與 EXPOCITY，再接原定 Costco 採買。",
      trigger: "箕面步道濕滑、山區大雨或雷雨時啟用。",
      stops: [
        { time: "08:00", place: "KYOTO TANGO MIYAZU inn", note: "照原時間退房，直接往吹田移動。" },
        { time: "10:30", place: "NIFREL", note: "水族、動物與藝術結合的全天候室內設施，建議先線上購票。" },
        { time: "12:45", place: "LaLaport EXPOCITY", note: "在同園區室內用餐與休息，減少上下車淋雨。" },
        { time: "14:15", place: "Costco 好市多門真倉庫店", note: "接回原定採買，再前往大阪住宿。" },
      ],
      sources: [
        { label: "NIFREL 官方資訊", url: "https://www.nifrel.jp/en/" },
      ],
    },
    6: {
      title: "港區全室內慢遊",
      summary: "海遊館看久一點，遊船與摩天輪視風雨取消，直接接商場與溫泉。",
      trigger: "港區強風、雷雨、低能見度，或現場公告船班／摩天輪停駛時啟用。",
      stops: [
        { time: "09:20", place: "木津市場", note: "保留市場早餐；上下車時注意積水。" },
        { time: "10:30", place: "海遊館", note: "放慢速度看完整展區與餵食時段，不必趕著搭船。" },
        { time: "14:00", place: "天保山 Market Place", note: "在室內午餐、購物；雨勢變小再評估摩天輪。" },
        { time: "16:00", place: "空庭溫泉 OSAKA BAY TOWER", note: "泡湯、用餐與休息都能在館內完成；9/11 非 2026 年 9 月休館日。" },
      ],
      sources: [
        { label: "海遊館", url: "https://www.kaiyukan.com/language/eng/" },
        { label: "空庭溫泉", url: "https://solaniwa.com/en-us/price/" },
      ],
    },
    7: {
      title: "大阪歷史與地下街",
      summary: "取消兩段遊船與露天神社，把大阪城周邊歷史、拱廊與地下街連起來。",
      trigger: "護城河或道頓堀船班停駛，或午後雷雨持續時啟用。",
      stops: [
        { time: "09:30", place: "大阪歷史博物館", note: "從高樓層看大阪城並認識城市歷史，主要動線都在室內。" },
        { time: "12:00", place: "心齋橋筋商店街", note: "在有頂棚的商店街吃午餐與採買。" },
        { time: "14:00", place: "Crysta 長堀", note: "轉入與心齋橋站直結的地下街，避開午後雨勢。" },
        { time: "15:30", place: "難波 Walk", note: "一路逛到日本橋方向；之後可先回住宿休息。" },
        { time: "19:30", place: "道頓堀水上觀光船", note: "僅在官方確認正常運航時回來搭已預約船班，否則留在難波室內用餐。" },
      ],
      sources: [
        { label: "Crysta 長堀", url: "https://osaka-info.jp/en/spot/crysta-nagahori/" },
        { label: "難波 Walk", url: "https://osaka-info.jp/en/spot/namba-walk/" },
      ],
    },
    8: {
      title: "天王寺藝術與百貨",
      summary: "動物園改成美術館，和阿倍野 Harukas 串成幾乎不必撐傘的一日。",
      trigger: "上午持續降雨、動物活動受影響，或同行者不想走濕滑園區時啟用。",
      stops: [
        { time: "09:30", place: "大阪市立美術館", note: "2025 年整修後重新開館；9/13 是星期日，可依當期展覽決定停留時間。" },
        { time: "11:30", place: "近鐵百貨 海闊天空總店", note: "室內午餐與購物，和車站、Harukas 直接相連。" },
        { time: "13:00", place: "Harukas 300", note: "雲層抬高再上展望台；若完全白牆，改逛阿倍野 Q's Mall。" },
        { time: "14:30", place: "阿倍野 Q's Mall", note: "把親子休息、甜點與採買放在室內完成。" },
      ],
      sources: [
        { label: "大阪市立美術館", url: "https://www.osaka-art-museum.jp/" },
        { label: "Harukas 300", url: "https://discover.osaka-info.jp/en/spots/abeno-harukas" },
      ],
    },
    9: {
      title: "梅田與天神橋室內日",
      summary: "展望設施能見度差就不花票錢，改逛知識空間、商店街與大阪生活今昔館。",
      trigger: "低雲遮住市景、摩天輪停駛，或午後持續大雨時啟用。",
      stops: [
        { time: "10:00", place: "Grand Front Osaka", note: "從大阪站進室內商場與 Knowledge Capital，先避開早上雨勢。" },
        { time: "11:30", place: "天神橋筋商店街", note: "在拱廊內吃午餐，再步行前往博物館。" },
        { time: "13:00", place: "大阪生活今昔館", note: "重現江戶大阪街景；9/14 是星期一，固定休館日為星期二。" },
        { time: "15:30", place: "Whity 梅田", note: "回到梅田地下街喝咖啡、購物，雨勢變小再決定是否補看夜景。" },
        { time: "17:00", place: "玉出超市 天神橋店", note: "照原計畫完成採買後回住宿。" },
      ],
      sources: [
        { label: "大阪生活今昔館", url: "https://osaka-info.jp/en/spot/osaka-museum-housing-living/" },
      ],
    },
    10: {
      title: "USJ 雨天遊玩順序",
      summary: "園區照常去，把室內設施排前面，動態停駛與等候時間一律看官方 App。",
      trigger: "只要降雨就帶輕便雨衣；遇雷雨或強風時，以園方安全公告為準。",
      stops: [
        { time: "06:16", place: "日本環球影城", note: "照原計畫提早抵達；雨傘收進袋中，搭設施前固定好隨身物品。" },
        { time: "開園後", place: "Mario Kart: Koopa's Challenge", note: "先處理超級任天堂世界的區域入場與室內重點設施。" },
        { time: "上午", place: "Harry Potter and the Forbidden Journey", note: "優先排主要室內乘車設施；戶外雲霄飛車留待天候穩定。" },
        { time: "午後", place: "Despicable Me Minion Mayhem", note: "搭配 SING on Tour、室內商店與餐廳，隨官方 App 即時調整。" },
      ],
      sources: [
        { label: "USJ 官方服務指南", url: "https://www.usj.co.jp/web/en/us/service-guide" },
        { label: "USJ 園區地圖與營運資訊", url: "https://www.usj.co.jp/web/en/us/service-guide/parkmap" },
      ],
    },
    11: {
      title: "提早進機場最安心",
      summary: "回程日不加塞景點；豪雨時提早 30–60 分鐘出發，把延誤緩衝留給交通。",
      trigger: "豪雨、強風、颱風接近，或 JR／南海電鐵出現延誤訊息時啟用。",
      stops: [
        { time: "07:15", place: "鹿の宿", note: "比原計畫提早退房，出門前再次查列車與機場公告。" },
        { time: "08:45", place: "關西國際機場 第一航廈", note: "BR181 於 12:10 起飛；完成報到後再在航廈內早餐與採買。" },
        { time: "10:10", place: "關西國際機場 國際線出境", note: "最晚在起飛前 2 小時進入出境流程，不安排臨空城繞路。" },
      ],
      sources: [
        { label: "關西機場官方資訊", url: "https://www.kansai-airport.or.jp/en/" },
      ],
    },
  };
});
