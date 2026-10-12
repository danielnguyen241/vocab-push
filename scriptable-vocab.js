// === Vocab Lock Screen Widget v3 (Dynamic GitHub Control) ===
// Tác giả: Daniel Nguyen
// Repo: https://github.com/danielnguyen241/vocab-push
// 
// LƯU Ý: Bạn chỉ cần dán code này vào app Scriptable ĐÚNG 1 LẦN DUY NHẤT.
// Sau này đổi chủ đề, thêm từ vựng, đổi tốc độ chạy... CHỈ CẦN SỬA FILE config.json TRÊN GITHUB!

const GITHUB_USER = "danielnguyen241";
const GITHUB_REPO = "vocab-push";
const GITHUB_BRANCH = "main";
const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;

const CACHE_CONFIG_NAME = "vocab_cfg.json";
const CACHE_DECK_NAME = "vocab_deck.json";

const fm = FileManager.local();
const docDir = fm.documentsDirectory();

function saveLocal(filename, obj) {
  try {
    const p = fm.joinPath(docDir, filename);
    fm.writeString(p, JSON.stringify(obj));
  } catch (e) {}
}

function readLocal(filename) {
  try {
    const p = fm.joinPath(docDir, filename);
    if (fm.fileExists(p)) {
      return JSON.parse(fm.readString(p));
    }
  } catch (e) {}
  return null;
}

// 1. Tải config.json từ GitHub
async function loadConfig() {
  const url = `${BASE_URL}/config.json?t=${Date.now()}`;
  try {
    const req = new Request(url);
    req.timeoutInterval = 8;
    const cfg = await req.loadJSON();
    if (cfg && cfg.decks) {
      saveLocal(CACHE_CONFIG_NAME, cfg);
      return cfg;
    }
  } catch (e) {}

  const cached = readLocal(CACHE_CONFIG_NAME);
  if (cached) return cached;

  return {
    active_deck: "business",
    interval_minutes: 30,
    shuffle: true,
    level_filter: "ALL",
    decks: {
      business: { name: "Business", file: "decks/business.json" }
    }
  };
}

// 2. Tải deck từ GitHub theo active_deck
async function loadDeck(cfg) {
  const deckKey = cfg.active_deck || "business";
  const deckInfo = (cfg.decks && cfg.decks[deckKey]) || { name: deckKey, file: "words.json" };
  const filePath = deckInfo.file || "words.json";
  const url = `${BASE_URL}/${filePath}?t=${Date.now()}`;

  try {
    const req = new Request(url);
    req.timeoutInterval = 10;
    const words = await req.loadJSON();
    if (Array.isArray(words) && words.length > 0) {
      const data = { key: deckKey, name: deckInfo.name || deckKey, words: words };
      saveLocal(CACHE_DECK_NAME, data);
      return data;
    }
  } catch (e) {}

  const cached = readLocal(CACHE_DECK_NAME);
  if (cached && Array.isArray(cached.words) && cached.words.length > 0) {
    return cached;
  }

  return {
    name: "Business",
    words: [
      { w: "synergy", ipa: "/ˈsɪnərdʒi/", vi: "sự kết hợp hiệp lực tối ưu", l: "B2" }
    ]
  };
}

// 3. Logic chọn từ
const config = await loadConfig();
const deck = await loadDeck(config);

let words = deck.words || [];

// Lọc level nếu có
if (config.level_filter && config.level_filter !== "ALL") {
  const filtered = words.filter(item => (item.l || "").toUpperCase() === config.level_filter.toUpperCase());
  if (filtered.length > 0) words = filtered;
}

const intervalMinutes = Math.max(5, config.interval_minutes || 30);
const slot = Math.floor(Date.now() / (intervalMinutes * 60 * 1000));

let index = 0;
if (config.shuffle) {
  // Hash pseudo-random dựa trên slot thời gian
  index = Math.abs((slot * 2654435761) ^ (slot >> 16)) % words.length;
} else {
  index = slot % words.length;
}

const w = words[index] || words[0];
const deckTag = deck.name || config.active_deck || "Vocab";

// 4. Render Widget
const widget = new ListWidget();
const fam = config.widgetFamily;

if (fam === "accessoryInline") {
  const inline = widget.addText(`${w.w} - ${w.vi}`);
  inline.font = Font.systemFont(13);
} else if (fam === "accessoryCircular") {
  widget.addSpacer();
  const cText = widget.addText(w.w);
  cText.font = Font.boldSystemFont(11);
  cText.centerAlignText();
  widget.addSpacer();
} else if (fam === "accessoryRectangular" || !fam) {
  // Widget chữ nhật màn hình khóa (Lock Screen)
  widget.addSpacer(2);

  const row1 = widget.addStack();
  row1.layoutHorizontally();

  if (config.show_tag !== false) {
    const tag = row1.addText(`[${w.l || deckTag.substring(0, 8)}] `);
    tag.font = Font.boldSystemFont(11);
    tag.textColor = Color.lightGray();
  }

  const wordText = row1.addText(w.w);
  wordText.font = Font.boldSystemFont(14);
  wordText.textColor = Color.white();
  wordText.lineLimit = 1;

  if (w.ipa) {
    row1.addSpacer(4);
    const ipaText = row1.addText(w.ipa);
    ipaText.font = Font.systemFont(11);
    ipaText.textColor = Color.gray();
    ipaText.lineLimit = 1;
  }

  widget.addSpacer(3);

  const viText = widget.addText(w.vi);
  viText.font = Font.systemFont(12);
  viText.textColor = Color.lightGray();
  viText.lineLimit = 2;
  widget.addSpacer(2);
} else {
  // Widget màn hình chính (Home Screen)
  widget.addSpacer(4);
  const tagText = widget.addText(`📚 ${deckTag} (${w.l || "ALL"})`);
  tagText.font = Font.boldSystemFont(12);
  tagText.textColor = Color.orange();
  widget.addSpacer(4);

  const wText = widget.addText(w.w + (w.ipa ? `  ${w.ipa}` : ""));
  wText.font = Font.boldSystemFont(18);
  wText.textColor = Color.white();
  widget.addSpacer(4);

  const meanText = widget.addText(w.vi);
  meanText.font = Font.systemFont(14);
  meanText.textColor = Color.lightGray();
  widget.addSpacer(4);
}

Script.setWidget(widget);
Script.complete();
