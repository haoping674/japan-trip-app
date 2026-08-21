const members = [
  { id: "member-kevin", name: "凱文", role: "旅伴", avatar: "", color: "#a86f4f" },
  { id: "member-neil", name: "尼歐", role: "旅伴", avatar: "", color: "#4d5144" },
  { id: "member-sheep", name: "小羊", role: "旅伴", avatar: "", color: "#d3a72f" },
  { id: "member-dax", name: "大俠", role: "旅伴", avatar: "", color: "#7b9da0" },
];

const tripDays = [
  { day: 1, date: "2026-09-06", area: "田尻町 → 京都市", weather: "京都", stops: [["12:40", "關西機場", "抵達關西，辦理入境與取車。"], ["16:17", "Guest House Kyoan", "京都住宿，放下行李後再出發。"], ["17:29", "伏見稻荷大社", "傍晚走進千本鳥居，留一些時間慢慢拍照。"], ["18:40", "Guest House Kyoan", "回住宿休息。"]] },
  { day: 2, date: "2026-09-07", area: "京都府 → 京都市", weather: "京都", stops: [["07:00", "Guest House Kyoan", "早起出發，避開東山人潮。"], ["07:29", "清水寺", "先看本堂與音羽瀑布。"], ["09:39", "二年坂／三年坂", "沿著石坂街景慢慢逛。"], ["10:53", "祇園花見小路", "町家街景，請保持安靜通行。"], ["11:37", "錦市場", "午餐與京都小吃。"], ["13:06", "Guest House Kyoan", "回去休息。"], ["15:07", "京都鐵道博物館", "結束後可到梅小路公園玩遊樂設施。"], ["19:13", "Guest House Kyoan", "回住宿。"]] },
  { day: 3, date: "2026-09-08", area: "高島市 → 福井縣", weather: "若狹", stops: [["09:00", "Guest House Kyoan", "離開京都，前往湖西。"], ["09:53", "白鬚神社", "琵琶湖上的鳥居。"], ["11:05", "琵琶湖兒童之國公園", "中午野餐；先到超市買東西。"], ["13:00", "若狹漁人碼頭", "海鮮午餐。"], ["14:33", "Party&Resort ZERO'sHOUSE", "小濱住宿。"], ["15:35", "小濱市三丁町歷史街區", "老街散步。"]] },
  { day: 4, date: "2026-09-09", area: "京都府 → 宮津市 → 小濱市", weather: "宮津", stops: [["09:00", "Party&Resort ZERO'sHOUSE", "出發往海之京都。"], ["09:51", "舞鶴港海鮮市場", "海鮮市場早午餐。"], ["13:11", "伊根浦觀光案內", "舟屋聚落資訊與停車。"], ["14:32", "天橋立傘松公園", "搭纜車眺望天橋立。"], ["15:51", "智恩寺", "文殊信仰寺院。"], ["16:56", "道之驛 京都 by the Sea MIYAZU", "補給與伴手禮。"], ["17:59", "KYOTO TANGO MIYAZU inn", "宮津住宿。"]] },
  { day: 5, date: "2026-09-10", area: "箕面市 → 西成區", weather: "大阪", stops: [["08:00", "KYOTO TANGO MIYAZU inn", "離開宮津。"], ["08:52", "休息站", "補給與休息。"], ["10:51", "勝尾寺", "達摩與勝運信仰。"], ["11:58", "箕面大瀧", "山林瀑布散步。"], ["13:31", "Costco 好市多門真倉庫店", "採買補貨。"], ["15:02", "鹿の宿", "大阪住宿。"]] },
  { day: 6, date: "2026-09-11", area: "西成區 → 港區", weather: "大阪", stops: [["08:00", "鹿の宿", "早餐後出發。"], ["09:20", "木津市場", "市場早餐。"], ["10:59", "海遊館", "看海洋生物。"], ["13:32", "帆船型觀光船 聖瑪麗亞號", "港區水上行程。"], ["14:34", "天保山大摩天輪", "港景與天空。"], ["15:52", "空庭溫泉", "泡湯休息。"], ["19:31", "鹿の宿", "回住宿。"]] },
  { day: 7, date: "2026-09-12", area: "西成區 → 浪速區", weather: "大阪", stops: [["08:00", "鹿の宿", "出發。"], ["08:48", "大阪城", "城跡與公園。"], ["10:26", "大阪城御座船乘船處", "護城河遊船。"], ["11:31", "難波八阪神社", "巨型獅子殿。"], ["12:51", "心齋橋筋商店街", "購物與午餐。"], ["14:55", "道頓堀水上觀光船", "已預約 20:00–20:30；日本橋站 6 號出口步行約 5 分鐘。"], ["16:23", "鹿の宿", "回住宿。"]] },
  { day: 8, date: "2026-09-13", area: "阿倍野區 → 天王寺區", weather: "大阪", stops: [["08:00", "鹿の宿", "出發。"], ["09:28", "大阪市天王寺動物園", "親子動物園。"], ["11:04", "通天閣", "新世界地標。"], ["12:17", "Harukas 300 Helipad", "高空展望。"], ["13:30", "鹿の宿", "回住宿。"]] },
  { day: 9, date: "2026-09-14", area: "北區 → 西成區", weather: "大阪", stops: [["08:00", "鹿の宿", "出發。"], ["09:41", "梅田藍天大廈 空中庭園展望台", "城市景觀。"], ["10:42", "HEP FIVE 摩天輪", "紅色摩天輪。"], ["11:21", "天神橋筋商店街", "在地商店街。"], ["12:31", "大阪生活今昔館", "室內街景博物館。"], ["14:36", "扇町公園", "休息與遊玩。"], ["16:11", "玉出超市 天神橋店", "採買。"], ["17:29", "鹿の宿", "回住宿。"]] },
  { day: 10, date: "2026-09-15", area: "西成區 → 此花區", weather: "大阪", stops: [["05:05", "鹿の宿", "早起準備。"], ["06:16", "日本環球影城", "全天 USJ 行程。"]] },
  { day: 11, date: "2026-09-16", area: "西成區 → 田尻町", weather: "關西", stops: [["08:00", "鹿の宿", "收拾行李。"], ["09:35", "關西機場站", "搭車前往機場。"]] },
];

const bookingData = {
  flight: { airline: "", code: "AK170", from: "高雄", fromCode: "KHH", departure: "08:30", to: "關西", toCode: "KIX", arrival: "12:40", duration: "03h10m", date: "2026/09/06", baggage: "", aircraft: "", price: "", purchased: "", purchaseNote: "" },
  flights: [
    { code: "AK170", label: "去程", date: "2026-09-06", departure: "08:30", arrival: "12:40", from: "高雄", to: "關西" },
    { code: "BR181", label: "回程", date: "2026-09-16", departure: "12:10", arrival: "14:30", from: "關西", to: "高雄" },
  ],
  stays: [
    { name: "Guest House Kyoan", location: "京都", detail: "9/06–9/08 · 京都", checkIn: "2026-09-06", checkInTime: "15:00", checkOut: "2026-09-08", checkOutTime: "11:00", total: "" },
    { name: "Party&Resort ZERO'sHOUSE", location: "小濱", detail: "9/08 · 小濱", checkIn: "2026-09-08", checkInTime: "15:00", checkOut: "2026-09-09", checkOutTime: "11:00", total: "" },
    { name: "KYOTO TANGO MIYAZU inn", location: "宮津", detail: "9/09 · 宮津", checkIn: "2026-09-09", checkInTime: "15:00", checkOut: "2026-09-10", checkOutTime: "11:00", total: "" },
    { name: "鹿の宿", location: "大阪西成", detail: "9/10–9/15 · 大阪西成", checkIn: "2026-09-10", checkInTime: "15:00", checkOut: "2026-09-16", checkOutTime: "11:00", total: "" },
  ],
  rental: { title: "關西租車", company: "", reservation: "", pickup: "", pickupLocation: "", return: "", returnLocation: "" },
  vouchers: [{ type: "機票", title: "機票_凱文", file: "PDF" }],
};

const planningItems = [
  { id: "todo-passport", category: "todo", title: "換護照", note: "", assignees: ["member-kevin", "member-neil", "member-sheep"], completedBy: ["member-kevin", "member-neil", "member-sheep"] },
  { id: "todo-currency", category: "todo", title: "換外幣", note: "", assignees: ["member-kevin", "member-neil", "member-sheep", "member-dax"], completedBy: ["member-kevin", "member-neil", "member-sheep", "member-dax"] },
  { id: "todo-insurance", category: "todo", title: "旅遊平安險", note: "", assignees: ["member-kevin", "member-neil", "member-sheep", "member-dax"], completedBy: ["member-kevin", "member-neil", "member-sheep"] },
  { id: "todo-stay", category: "todo", title: "換外幣與住宿確認", note: "", assignees: ["member-kevin", "member-neil", "member-sheep", "member-dax"], completedBy: [] },
  { id: "packing-camera", category: "packing", title: "RX100 相機", note: "", assignees: ["member-kevin"], completedBy: [] },
  { id: "packing-card", category: "packing", title: "記憶卡", note: "", assignees: ["member-kevin"], completedBy: [] },
  { id: "packing-chair", category: "packing", title: "露營椅", note: "", assignees: ["member-kevin"], completedBy: [] },
  { id: "packing-charger", category: "packing", title: "充電器與行動電源", note: "", assignees: ["member-neil"], completedBy: [] },
  { id: "wishlist-tea", category: "wishlist", title: "茶餐廳", note: "想找一間在地人會去的店。", assignees: ["member-neil"], completedBy: [] },
  { id: "wishlist-market", category: "wishlist", title: "錦市場散步", note: "", assignees: ["member-sheep"], completedBy: [] },
  { id: "shopping-beer", category: "shopping", title: "啤酒", note: "", assignees: ["member-kevin"], completedBy: [] },
  { id: "shopping-snack", category: "shopping", title: "零食", note: "", assignees: ["member-sheep"], completedBy: [] },
];

function buildDefaultState() {
  return {
    day: 1,
    done: {},
    tasks: {},
    expenses: [],
    journal: [],
    planningTab: "todo",
    planningMemberFilter: "all",
    tripDays,
    bookings: bookingData,
    planningItems,
    members,
  };
}

module.exports = { buildDefaultState };
