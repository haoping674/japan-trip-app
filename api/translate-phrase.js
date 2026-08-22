function parseBody(body) {
  if (!body) return {};
  if (typeof body === "object") return body;
  return JSON.parse(body);
}

function translatedText(payload) {
  return Array.isArray(payload?.[0])
    ? payload[0]
      .filter((part) => Array.isArray(part) && typeof part[0] === "string")
      .map((part) => part[0])
      .join("")
      .trim()
    : "";
}

function romanizedText(payload) {
  if (!Array.isArray(payload?.[0])) return "";
  const part = payload[0].find((item) => Array.isArray(item) && typeof item[2] === "string" && item[2].trim());
  return part?.[2]?.trim() || "";
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = parseBody(req.body);
    const zh = String(payload?.zh || "").trim().slice(0, 80);
    if (!zh) return res.status(400).json({ error: "中文提示不可為空" });

    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "zh-TW");
    url.searchParams.set("tl", "ja");
    url.searchParams.append("dt", "t");
    url.searchParams.append("dt", "rm");
    url.searchParams.set("q", zh);

    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Translation request failed: ${response.status}`);
    const result = await response.json();
    const ja = translatedText(result);
    const roma = romanizedText(result);
    if (!ja) throw new Error("Translation response was empty");

    return res.status(200).json({ ja, roma });
  } catch (error) {
    return res.status(502).json({ error: "無法自動產生日文，請確認網路後重試", detail: error.message });
  }
};
