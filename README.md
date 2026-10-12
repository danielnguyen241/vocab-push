# 📚 Vocab Lock Screen Widget (Dynamic Multi-Deck)

Widget học từ vựng tiếng Anh trên màn hình khóa iPhone (hỗ trợ Always-On Display trên iPhone 14 Pro Max trở lên).

---

## 🚀 Điểm đặc biệt: Điều khiển 100% từ GitHub

Bạn **chỉ cần dán code vào app Scriptable trên iPhone ĐÚNG 1 LẦN DUY NHẤT**.
Mọi thao tác sau này (đổi chủ đề, tăng giảm thời gian đổi từ, lọc trình độ, thêm deck mới) đều **chỉnh trực tiếp qua file `config.json` trên GitHub** mà không cần mở lại app trên điện thoại!

---

## ⚙️ Cấu hình trung tâm (`config.json`)

Mở file `config.json` trên GitHub và bấm sửa:

```json
{
  "active_deck": "business",        // Đổi chủ đề học: "business", "marketing", "ielts_c1", "phrasal_verbs"
  "interval_minutes": 30,          // Thời gian đổi từ mới (ví dụ: 15, 30, 60 phút)
  "shuffle": true,                 // true = ngẫu nhiên | false = tuần tự từ đầu đến cuối
  "level_filter": "ALL",           // "ALL", "B1", "B2", "C1", "C2"
  "show_tag": true,                // Hiện nhãn [B2], [C1] trên widget
  "decks": {
    "business": {
      "name": "Business & Ops",
      "file": "decks/business.json"
    },
    "marketing": {
      "name": "Marketing & Growth",
      "file": "decks/marketing.json"
    },
    "ielts_c1": {
      "name": "IELTS Academic",
      "file": "decks/ielts_c1.json"
    },
    "phrasal_verbs": {
      "name": "Phrasal Verbs Pro",
      "file": "decks/phrasal_verbs.json"
    }
  }
}
```

---

## 📂 Các bộ từ vựng có sẵn trong `decks/`

1. **`decks/business.json`**: 162 từ vựng quản trị doanh nghiệp, đàm phán, chiến lược, vận hành.
2. **`decks/marketing.json`**: Các thuật ngữ Digital Marketing, Funnel, Conversion, CAC/LTV, SEO.
3. **`decks/ielts_c1.json`**: Từ vựng học thuật C1-C2 cao cấp (ubiquitous, deleterious, exacerbate...).
4. **`decks/phrasal_verbs.json`**: Cụm động từ tự nhiên trong giao tiếp & công việc (figure out, carry out...).

### Muốn tạo thêm chủ đề mới?
1. Tạo 1 file mới trong thư mục `decks/` (ví dụ `decks/tieng_nhat.json` hoặc `decks/phap_luat.json`).
2. Khai báo tên file vào `config.json` ở mục `decks`.
3. Đổi `"active_deck": "tên_mới"` → Điện thoại tự động học bộ mới!
