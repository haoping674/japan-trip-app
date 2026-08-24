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

function googleLiteText(payload) {
  return Array.isArray(payload) && typeof payload[0] === "string" ? payload[0].trim() : "";
}

function myMemoryText(payload) {
  const translated = payload?.responseData?.translatedText;
  return typeof translated === "string" ? translated.trim() : "";
}

function yomitanReading(payload) {
  const reading = payload?.yomi?.[0];
  return typeof reading === "string" ? reading.trim() : "";
}

function romajiText(payload) {
  return typeof payload?.a === "string" ? payload.a.trim() : "";
}

async function fetchJson(url, label) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "osaka-travel-phrasebook/1.0" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`${label} request failed: ${response.status}`);
    const body = await response.text();
    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      throw new Error(`${label} returned invalid JSON`);
    }
    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

function spacedJapaneseReading(reading) {
  return reading
    .replace(/(?<=[ぁ-んァ-ン])(は|が|を|に|で(?!す)|へ|と(?!い)|も|の)(?=[ぁ-んァ-ン])/g, " $1 ")
    .replace(/(?<=[ぁ-んァ-ン])(です)(?=[ぁ-んァ-ン?？!！。]|$)/g, " $1")
    .replace(/(です|ます|でした|ました|ません)(?=[かねよ])/g, "$1 ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeRomaji(roma) {
  return roma
    .replace(/\bha(?=\s|$)/g, "wa")
    .replace(/\bhe(?=\s|$)/g, "e")
    .replace(/\bwo(?=\s|$)/g, "o")
    .replace(/\s+([?？!！。])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

async function romanizeJapanese(ja) {
  const readingUrl = new URL("https://yomitan.harmonicom.jp/api/v2/yomi");
  readingUrl.searchParams.set("ic", "UTF8");
  readingUrl.searchParams.set("oc", "UTF8");
  readingUrl.searchParams.set("kana", "h");
  readingUrl.searchParams.set("num", "1");
  readingUrl.searchParams.set("text", ja);
  const reading = yomitanReading(await fetchJson(readingUrl, "Yomitan reading"));
  if (!reading) throw new Error("Japanese reading was empty");

  const romajiUrl = new URL("https://api.romaji2kana.com/v1/to/romaji");
  romajiUrl.searchParams.set("q", spacedJapaneseReading(reading));
  const roma = normalizeRomaji(romajiText(await fetchJson(romajiUrl, "Romaji conversion")));
  if (!roma) throw new Error("Romaji response was empty");
  return roma;
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

    const googleUrl = new URL("https://translate.googleapis.com/translate_a/single");
    googleUrl.searchParams.set("client", "gtx");
    googleUrl.searchParams.set("sl", "zh-TW");
    googleUrl.searchParams.set("tl", "ja");
    googleUrl.searchParams.append("dt", "t");
    googleUrl.searchParams.append("dt", "rm");
    googleUrl.searchParams.set("q", zh);

    const googleLiteUrl = new URL("https://clients5.google.com/translate_a/t");
    googleLiteUrl.searchParams.set("client", "dict-chrome-ex");
    googleLiteUrl.searchParams.set("sl", "zh-TW");
    googleLiteUrl.searchParams.set("tl", "ja");
    googleLiteUrl.searchParams.set("q", zh);

    const myMemoryUrl = new URL("https://api.mymemory.translated.net/get");
    myMemoryUrl.searchParams.set("q", zh);
    myMemoryUrl.searchParams.set("langpair", "zh-TW|ja-JP");

    const providers = [
      { url:googleUrl, label:"Google Translate", parse:translatedText, roma:romanizedText },
      { url:googleLiteUrl, label:"Google Translate fallback", parse:googleLiteText },
      { url:myMemoryUrl, label:"MyMemory fallback", parse:myMemoryText },
    ];
    const failures = [];
    for (const provider of providers) {
      try {
        const result = await fetchJson(provider.url, provider.label);
        const ja = provider.parse(result);
        if (!ja) throw new Error("Translation response was empty");
        let roma = provider.roma ? provider.roma(result) : "";
        if (!roma) {
          try { roma = await romanizeJapanese(ja); } catch {}
        }
        return res.status(200).json({ ja, roma });
      } catch (error) {
        failures.push(error.message);
      }
    }
    throw new Error(failures.join("; "));
  } catch (error) {
    return res.status(502).json({ error: "無法自動產生日文，請確認網路後重試", detail: error.message });
  }
};
