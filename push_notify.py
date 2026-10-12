#!/usr/bin/env python3
"""
Vocab Push Notification Engine for Daniel
Topic: daniel-vocab-fde62f1750cd4175
"""

import os
import sys
import json
import time
import random
import urllib.request
from datetime import datetime, timezone, timedelta

TOPIC = "daniel-vocab-fde62f1750cd4175"
NTFY_URL = f"https://ntfy.sh/{TOPIC}"

def check_quiet_hours():
    # Giờ Việt Nam (UTC+7)
    vn_tz = timezone(timedelta(hours=7))
    now = datetime.now(vn_tz)
    hour = now.hour
    minute = now.minute

    # Giờ ngủ của Daniel: 23:30 đến 08:00 sáng
    is_sleep_time = (hour < 8) or (hour == 23 and minute >= 30)
    
    # Cho phép bypass khi chạy bằng tay (workflow_dispatch hoặc test terminal)
    is_manual = os.environ.get("GITHUB_EVENT_NAME") == "workflow_dispatch" or len(sys.argv) > 1 and sys.argv[1] == "--force"
    
    if is_sleep_time and not is_manual:
        print(f"🛌 Quiet hours active (Vietnam time: {now.strftime('%H:%M')}). Notification skipped.")
        sys.exit(0)
    
    print(f"⏰ Active learning hours (Vietnam time: {now.strftime('%H:%M:%S')})")

def load_word():
    # 1. Đọc config.json nếu có
    active_deck = "business"
    deck_path = "words.json"
    
    if os.path.exists("config.json"):
        try:
            with open("config.json", "r", encoding="utf-8") as f:
                cfg = json.load(f)
                active_deck = cfg.get("active_deck", "business")
                decks = cfg.get("decks", {})
                if active_deck in decks and "file" in decks[active_deck]:
                    deck_path = decks[active_deck]["file"]
        except Exception as e:
            print(f"Warning loading config: {e}")

    # 2. Đọc file từ vựng
    if not os.path.exists(deck_path):
        deck_path = "words.json"
        
    with open(deck_path, "r", encoding="utf-8") as f:
        words = json.load(f)
        
    if not words:
        raise ValueError("Word list is empty!")
        
    return random.choice(words)

def send_notification(word_item):
    w = word_item.get("w", "").strip()
    ipa = word_item.get("ipa", "").strip()
    s = word_item.get("s", "").strip() or ipa
    vi = word_item.get("vi", "").strip()
    ex = word_item.get("ex", "").strip()
    level = word_item.get("l", "PRO").strip()
    
    # Tiêu đề sang trọng & nổi bật trên màn hình khóa: TỪ VỰNG [Level] · IPA
    title = f"{w.upper()} [{level}]"
    if ipa:
        title += f" · {ipa}"
        
    # Nội dung 3 dòng cô đọng, dễ đọc lướt trong 3 giây
    lines = []
    if s:
        lines.append(f"🗣️ Đọc: {s}")
    if vi:
        lines.append(f"🎯 Nghĩa: {vi}")
    if ex:
        lines.append(f"💬 Ví dụ: \"{ex}\"")
        
    body = "\n".join(lines)
    
    # Gửi qua ntfy.sh
    req = urllib.request.Request(
        NTFY_URL,
        data=body.encode("utf-8"),
        headers={
            "Title": title.encode("utf-8"),
            "Tags": "mortarboard",
            "Priority": "default"
        }
    )
    
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            res_body = res.read().decode("utf-8")
            print(f"✅ Notification sent successfully! Word: {w}")
            print(f"ntfy response: {res_body}")
    except Exception as e:
        print(f"❌ Error sending to ntfy: {e}")
        sys.exit(1)

def main():
    # Nếu chạy từ cron tự động, tạo độ trễ ngẫu nhiên (jitter 0-600s ~ 0-10 phút)
    is_cron = os.environ.get("GITHUB_EVENT_NAME") == "schedule"
    if is_cron:
        jitter_seconds = random.randint(0, 600)
        print(f"🎲 Random schedule jitter: waiting {jitter_seconds} seconds before sending...")
        time.sleep(jitter_seconds)
        
    check_quiet_hours()
    word = load_word()
    send_notification(word)

if __name__ == "__main__":
    main()
