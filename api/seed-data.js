const rainyPlans = require("../rain-plans");

const ITINERARY_REVISION = "funliday-2026-09-04";
const KANSAI_NOTES_REVISION = "kansai-pdf-notes-2026-09-11";

const members = [
  { id: "member-kevin", name: "凱文", role: "旅伴", avatar: "", color: "#a86f4f" },
  { id: "member-neil", name: "尼歐", role: "旅伴", avatar: "", color: "#4d5144" },
  { id: "member-sheep", name: "小羊", role: "旅伴", avatar: "", color: "#d3a72f" },
  { id: "member-dax", name: "大俠", role: "旅伴", avatar: "", color: "#7b9da0" },
];

const tripDays = [
  { day: 1, date: "2026-09-06", area: "京都府 → 大阪府 → 伏見區", weather: "京都", weatherLocation: { latitude: 35.0116, longitude: 135.7681 }, stops: [["12:40", "關西機場", "入境後依當日指示前往京都。Haruka 轉 JR 奈良線到東福寺時不要出站，搭「普通 Local」；みやこ路快速會跳過東福寺。班次與月台以現場公告為準。"], ["16:17", "Guest House Kyoan(京都住宿)", ""], ["17:29", "伏見稻荷大社", ""], ["19:49", "Guest House Kyoan(京都住宿)", ""]] },
  { day: 2, date: "2026-09-07", area: "京都府 → 下京區 → 東山區", weather: "京都", weatherLocation: { latitude: 35.0116, longitude: 135.7681 }, stops: [["07:00", "Guest House Kyoan(京都住宿)", ""], ["07:29", "清水寺", ""], ["09:39", "二年坂/三年坂", ""], ["10:53", "祇園花見小路", "花見小路周邊私人道路禁止拍攝；遇到舞妓請勿追拍或近距離打擾。"], ["11:37", "錦市場", "不可邊走邊吃；部分店家不開放拍攝，建議準備少量現金。"], ["13:06", "Guest House Kyoan(京都住宿)", "回去休息~~"], ["15:06", "京都鐵道博物館", "若提早離館，可步行到旁邊的梅小路公園與免費兒童遊戲區。"], ["17:32", "Guest House Kyoan(京都住宿)", ""]] },
  { day: 3, date: "2026-09-08", area: "京都府 → 高島市 → 福井縣", weather: "若狹", weatherLocation: { latitude: 35.4950, longitude: 135.7460 }, stops: [["09:00", "Guest House Kyoan(京都住宿)", ""], ["09:53", "白鬚神社", ""], ["10:35", "琵琶湖兒童之國公園", "在這邊中午野餐~ 先去超市買東西~~ 天候允許再停留，並備好換洗衣物與毛巾。"], ["12:30", "若狹漁人碼頭", "預約15:30搭船~~ 若天候停駛或錯過船班，改去御食國若狹小濱食文化館；以當日船班公告為準。"], ["14:03", "Party&Resort ZERO'sHOUSE", ""], ["15:05", "小濱市三丁町歷史街區", ""]] },
  { day: 4, date: "2026-09-09", area: "小濱市 → → 舞鶴市", weather: "宮津", weatherLocation: { latitude: 35.5350, longitude: 135.1950 }, stops: [["09:00", "Party&Resort ZERO'sHOUSE", ""], ["09:51", "舞鶴港海鮮市場", ""], ["11:53", "天橋立傘松公園", "可選擇吊椅、胯下望與投瓦片；營運、票價與是否收現金以現場為準。"], ["14:15", "伊根浦觀光案內", "先索取免費地圖；若行程有餘裕，再選擇伊根灣遊覽船或舟屋見學，勿壓縮入住時間。"], ["16:52", "Roadside Station Kyoto by the Sea MIYAZU", ""], ["17:55", "KYOTO TANGO MIYAZU inn(宮津住宿)", ""]] },
  { day: 5, date: "2026-09-10", area: "箕面市 → 宮津市 → 西成區", weather: "大阪", weatherLocation: { latitude: 34.6937, longitude: 135.5023 }, stops: [["07:30", "KYOTO TANGO MIYAZU inn(宮津住宿)", ""], ["08:22", "休息站", ""], ["10:21", "Katsuoji", ""], ["12:58", "箕面大滝", "步道濕滑時改採雨天備案；穿著防滑、好走的鞋。"], ["14:31", "Costco 好市多 門真倉庫店", "結帳建議備 Mastercard 或日幣現金；台灣會員卡使用自助加油的限制，當天請直接向店員確認。"], ["18:02", "鹿の宿", ""]] },
  { day: 6, date: "2026-09-11", area: "大阪府 → 西成區 → 港區", weather: "大阪", weatherLocation: { latitude: 34.6937, longitude: 135.5023 }, stops: [["08:00", "鹿の宿", ""], ["08:20", "木津市場", ""], ["10:25", "天保山大摩天輪", "若想搭水晶車廂，先向現場確認候位與營運狀況。"], ["11:30", "海遊館", "已購票 11:30-45 入場；入館後先查看當日餵食秀時間表。"], ["14:04", "帆船型觀光船 聖瑪麗亞號", "如果這點4點前已跑完，我有預約4點樂高進場，可以去晃晃看看"], ["15:55", "空庭溫泉", "穿浴衣時左襟在上、右襟在下；內搭輕薄貼身衣物會更自在。"], ["19:36", "鹿の宿", ""]] },
  { day: 7, date: "2026-09-12", area: "大阪府 → 浪速區 → 西成區", weather: "大阪", weatherLocation: { latitude: 34.6937, longitude: 135.5023 }, stops: [["08:00", "鹿の宿", ""], ["08:48", "大阪城", ""], ["10:26", "大阪城御座船乘船處", ""], ["11:35", "難波八阪神社", ""], ["12:55", "心齋橋筋商店街", ""], ["14:59", "道頓堀水上觀光船", "已預約 20:00–20:30。由日本橋站 6 號出口步行約 5 分鐘；乘船處以預約通知為準。"], ["16:28", "鹿の宿", ""]] },
  { day: 8, date: "2026-09-13", area: "大阪府 → 奈良縣 → 西成區", weather: "大阪", weatherLocation: { latitude: 34.6937, longitude: 135.5023 }, stops: [["07:05", "鹿の宿", ""], ["09:21", "奈良公園", ""], ["10:32", "志津香釜飯 公園店", "熱門時段可能排隊，彈性調整停留時間。"], ["12:44", "東大寺大佛殿", ""], ["14:48", "若草山", "有上坡與階梯；穿好走的鞋、備水與防曬，依體力折返。"], ["16:18", "春日大社", ""], ["18:18", "鹿の宿", ""]] },
  { day: 9, date: "2026-09-14", area: "大阪府 → 北區 → 西成區", weather: "大阪", weatherLocation: { latitude: 34.6937, longitude: 135.5023 }, stops: [["09:00", "鹿の宿", ""], ["09:53", "梅田藍天大廈 空中庭園展望台", "能見度不佳時先改走室內行程，再決定是否購票上樓。"], ["12:55", "HEP FIVE 摩天輪", ""], ["13:32", "大阪生活今昔館", ""], ["15:42", "天神橋筋商店街", ""], ["16:51", "扇町公園", ""], ["18:25", "玉出超市 天神橋店", "24 小時營業，可在此補飲料、宵夜與隔日零食。"], ["20:02", "鹿の宿", ""]] },
  { day: 10, date: "2026-09-15", area: "大阪府 → 阿倍野區 → 中央區", weather: "大阪", weatherLocation: { latitude: 34.6937, longitude: 135.5023 }, stops: [["08:00", "鹿の宿", ""], ["08:28", "黑門市場", ""], ["10:05", "大阪市天王寺動物園", "入園後先查看當日動物餵食與活動時刻表。"], ["12:41", "通天閣", ""], ["15:56", "Harukas 300 Helipad", ""], ["17:08", "鹿の宿", ""]] },
  { day: 11, date: "2026-09-16", area: "大阪府 → 泉南郡 → 西成區", weather: "關西", weatherLocation: { latitude: 34.4347, longitude: 135.2440 }, stops: [["08:00", "鹿の宿", ""], ["09:22", "關西機場", ""]] },
].map((item) => ({ ...item, rainPlan: rainyPlans[item.day] }));

const bookingData = {
  flight: { airline: "", code: "AK170", from: "高雄", fromCode: "KHH", departure: "08:30", to: "關西", toCode: "KIX", arrival: "12:40", duration: "03h10m", date: "2026/09/06", baggage: "", aircraft: "", price: "", purchased: "", purchaseNote: "" },
  flights: [
    { code: "AK170", label: "去程", airline: "亞洲航空", date: "2026-09-06", departure: "08:30", arrival: "12:40", from: "高雄", to: "關西", terminal: "關西機場第一航廈（出發前確認）", baggageNote: "手提行李 1 件、總重 7kg；託運額度以電子訂單為準。", verifyNote: "PDF 的團體託運額度僅列為提醒，請出發前向航空公司確認。" },
    { code: "BR181", label: "回程", airline: "長榮航空", date: "2026-09-16", departure: "12:10", arrival: "14:30", from: "關西", to: "高雄", terminal: "關西機場第一航廈（出發前確認）", baggageNote: "手提行李與託運額度請以電子訂單為準。", verifyNote: "建議起飛前至少 2 小時完成報到與出境流程。" },
  ],
  activities: [
    { id: "activity-kaiyukan", title: "海遊館", date: "2026-09-11", time: "11:30–11:45", place: "海遊館", status: "已購票", note: "入館後先查看當日餵食秀時間表。" },
    { id: "activity-legoland", title: "大阪樂高探索中心", date: "2026-09-11", time: "16:00", place: "大阪樂高探索中心", status: "已預約", note: "聖瑪麗亞號行程有餘裕再前往。" },
    { id: "activity-wonder-cruise", title: "Wonder Cruise 道頓堀水上觀光船", date: "2026-09-12", time: "20:00–20:30", place: "Wonder Cruise", status: "已預約", note: "日本橋站 6 號出口步行約 5 分鐘；以預約通知的乘船處為準。" },
  ],
  stays: [
    { name: "Guest House Kyoan", location: "京都", detail: "9/06–9/08 · 京都", checkIn: "2026-09-06", checkInTime: "15:00", checkOut: "2026-09-08", checkOutTime: "11:00", total: "" },
    { name: "Party&Resort ZERO'sHOUSE", location: "小濱", detail: "9/08 · 小濱", checkIn: "2026-09-08", checkInTime: "15:00", checkOut: "2026-09-09", checkOutTime: "11:00", total: "" },
    { name: "KYOTO TANGO MIYAZU inn", location: "宮津", detail: "9/09 · 宮津", checkIn: "2026-09-09", checkInTime: "15:00", checkOut: "2026-09-10", checkOutTime: "11:00", total: "" },
    { name: "鹿の宿", location: "大阪西成", address: "1-chōme-8 Tamadenaka, Nishinari Ward, Osaka 557-0044, Japan", mapUrl: "https://maps.app.goo.gl/q3bXmjiCHYFD6WCZ7?g_st=il", detail: "9/10–9/15 · 大阪西成", checkIn: "2026-09-10", checkInTime: "15:00", checkOut: "2026-09-16", checkOutTime: "11:00", total: "" },
  ],
  rental: { title: "關西租車", company: "", reservation: "", pickup: "", pickupLocation: "", return: "", returnLocation: "" },
  vouchers: [{ type: "機票", title: "機票_凱文", file: "PDF" }],
};

const planningItems = [
  { id: "todo-passport", category: "todo", title: "換護照", note: "", assignees: ["member-kevin", "member-neil", "member-sheep"], completedBy: ["member-kevin", "member-neil", "member-sheep"] },
  { id: "todo-currency", category: "todo", title: "換外幣", note: "", assignees: ["member-kevin", "member-neil", "member-sheep", "member-dax"], completedBy: ["member-kevin", "member-neil", "member-sheep", "member-dax"] },
  { id: "todo-insurance", category: "todo", title: "旅遊平安險", note: "", assignees: ["member-kevin", "member-neil", "member-sheep", "member-dax"], completedBy: ["member-kevin", "member-neil", "member-sheep"] },
  { id: "todo-stay", category: "todo", title: "換外幣與住宿確認", note: "", assignees: ["member-kevin", "member-neil", "member-sheep", "member-dax"], completedBy: [] },
  { id: "todo-flight-check", category: "todo", title: "核對航班航廈、行李額度與票券", note: "以航空公司 App、電子訂單與當日機場公告為準；PDF 的航廈與託運資訊僅作行前提醒。", assignees: ["member-kevin", "member-neil", "member-sheep", "member-dax"], completedBy: [] },
  { id: "todo-offline-documents", category: "todo", title: "離線保存護照、訂單與住宿地址", note: "把電子訂單、住宿地址與緊急聯絡資料放入憑證匣或可離線存取的位置。", assignees: ["member-kevin", "member-neil", "member-sheep", "member-dax"], completedBy: [] },
  { id: "packing-camera", category: "packing", title: "RX100 相機", note: "", assignees: ["member-kevin"], completedBy: [] },
  { id: "packing-card", category: "packing", title: "記憶卡", note: "", assignees: ["member-kevin"], completedBy: [] },
  { id: "packing-chair", category: "packing", title: "露營椅", note: "", assignees: ["member-kevin"], completedBy: [] },
  { id: "packing-charger", category: "packing", title: "充電器與行動電源", note: "", assignees: ["member-neil"], completedBy: [] },
  { id: "packing-rain", category: "packing", title: "雨具與防水收納", note: "摺傘或輕便雨衣、夾鏈袋與備用毛巾。", assignees: ["member-kevin", "member-neil", "member-sheep", "member-dax"], completedBy: [] },
  { id: "packing-medicine", category: "packing", title: "常備藥與保健用品", note: "個人處方藥、腸胃／止痛／過敏藥與 OK 繃，放在隨身行李。", assignees: ["member-kevin", "member-neil", "member-sheep", "member-dax"], completedBy: [] },
  { id: "wishlist-tea", category: "wishlist", title: "茶餐廳", note: "想找一間在地人會去的店。", assignees: ["member-neil"], completedBy: [] },
  { id: "wishlist-market", category: "wishlist", title: "錦市場散步", note: "", assignees: ["member-sheep"], completedBy: [] },
  { id: "wishlist-ine-boat", category: "wishlist", title: "伊根灣遊覽船／舟屋見學", note: "Day 4 的選用活動；先看入住時間與現場船班再決定。", assignees: ["member-kevin", "member-neil", "member-sheep", "member-dax"], completedBy: [] },
  { id: "wishlist-crystal-wheel", category: "wishlist", title: "天保山水晶摩天輪車廂", note: "Day 6 視現場候位、天候與營運狀況決定。", assignees: ["member-kevin", "member-neil", "member-sheep", "member-dax"], completedBy: [] },
  { id: "shopping-beer", category: "shopping", title: "啤酒", note: "", assignees: ["member-kevin"], completedBy: [] },
  { id: "shopping-snack", category: "shopping", title: "零食", note: "", assignees: ["member-sheep"], completedBy: [] },
];

const japanesePhrases = [
  { category: "general", zh: "你好。", ja: "こんにちは。", roma: "Konnichiwa." },
  { category: "general", zh: "謝謝。", ja: "ありがとうございます。", roma: "Arigatou gozaimasu." },
  { category: "general", zh: "不好意思／借過。", ja: "すみません。", roma: "Sumimasen." },
  { category: "general", zh: "我不太會說日文。", ja: "日本語があまり話せません。", roma: "Nihongo ga amari hanasemasen." },
  { category: "general", zh: "請說慢一點。", ja: "もう少しゆっくり話してください。", roma: "Mou sukoshi yukkuri hanashite kudasai." },
  { category: "general", zh: "可以再說一次嗎？", ja: "もう一度お願いします。", roma: "Mou ichido onegaishimasu." },
  { category: "hotel", zh: "我要辦理入住。", ja: "チェックインをお願いします。", roma: "Chekku-in o onegaishimasu." },
  { category: "hotel", zh: "我有預約。", ja: "予約しています。", roma: "Yoyaku shiteimasu." },
  { category: "hotel", zh: "我們訂了兩間房。", ja: "部屋を二部屋予約しています。", roma: "Heya o futaheya yoyaku shiteimasu." },
  { category: "hotel", zh: "可以寄放行李嗎？", ja: "荷物を預かっていただけますか。", roma: "Nimotsu o azukatte itadakemasu ka." },
  { category: "hotel", zh: "退房時間是幾點？", ja: "チェックアウトは何時ですか。", roma: "Chekku-auto wa nanji desu ka." },
  { category: "restaurant", zh: "四位。", ja: "四人です。", roma: "Yonin desu." },
  { category: "restaurant", zh: "請給我菜單。", ja: "メニューをお願いします。", roma: "Menyuu o onegaishimasu." },
  { category: "restaurant", zh: "有推薦的料理嗎？", ja: "おすすめは何ですか。", roma: "Osusume wa nan desu ka." },
  { category: "restaurant", zh: "請給我這個。", ja: "これをください。", roma: "Kore o kudasai." },
  { category: "restaurant", zh: "請結帳。", ja: "お会計をお願いします。", roma: "Okaikei o onegaishimasu." },
  { category: "restaurant", zh: "可以刷卡嗎？", ja: "カードは使えますか。", roma: "Kaado wa tsukaemasu ka." },
  { category: "transport", zh: "請問車站在哪裡？", ja: "駅はどこですか。", roma: "Eki wa doko desu ka." },
  { category: "transport", zh: "這班車有到大阪嗎？", ja: "この電車は大阪に行きますか。", roma: "Kono densha wa Oosaka ni ikimasu ka." },
  { category: "transport", zh: "要在哪裡轉車？", ja: "どこで乗り換えますか。", roma: "Doko de norikaemasu ka." },
  { category: "transport", zh: "請到這個地址。", ja: "この住所までお願いします。", roma: "Kono juusho made onegaishimasu." },
  { category: "transport", zh: "我們迷路了。", ja: "道に迷いました。", roma: "Michi ni mayoimashita." },
  { category: "shopping", zh: "這個多少錢？", ja: "これはいくらですか。", roma: "Kore wa ikura desu ka." },
  { category: "shopping", zh: "可以試穿嗎？", ja: "試着してもいいですか。", roma: "Shichaku shite mo ii desu ka." },
  { category: "shopping", zh: "有別的尺寸嗎？", ja: "別のサイズはありますか。", roma: "Betsu no saizu wa arimasu ka." },
  { category: "shopping", zh: "可以免稅嗎？", ja: "免税できますか。", roma: "Menzei dekimasu ka." },
  { category: "shopping", zh: "請給我兩個。", ja: "これを二つください。", roma: "Kore o futatsu kudasai." },
  { category: "emergency", zh: "請幫幫我。", ja: "助けてください。", roma: "Tasukete kudasai." },
  { category: "emergency", zh: "請叫救護車。", ja: "救急車を呼んでください。", roma: "Kyuukyuusha o yonde kudasai." },
  { category: "emergency", zh: "我需要去醫院。", ja: "病院に行きたいです。", roma: "Byouin ni ikitai desu." },
  { category: "emergency", zh: "我的護照不見了。", ja: "パスポートをなくしました。", roma: "Pasupooto o nakushimashita." },
  { category: "emergency", zh: "請叫警察。", ja: "警察を呼んでください。", roma: "Keisatsu o yonde kudasai." },
];

function buildDefaultState() {
  return {
    itineraryRevision: ITINERARY_REVISION,
    kansaiNotesRevision: KANSAI_NOTES_REVISION,
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
    japanesePhrases,
    members,
  };
}

module.exports = { buildDefaultState };
