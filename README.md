# vocab-push

Word list for the iPhone lock-screen vocab widget (Scriptable).

## How to add words

Edit `words.json` — tap the pencil icon on github.com, or edit locally and push.
Add one line per word, keeping the same format:

```json
{"w": "synergy", "ipa": "/ˈsɪnərdʒi/", "vi": "hiệp lực"},
```

Fields:

- `w` — English word or phrase (required)
- `ipa` — pronunciation with slashes, e.g. `/ˈsɪnərdʒi/` (optional, use `""` if none)
- `vi` — Vietnamese meaning (required)
- `l` — CEFR level A1–C2 (optional)
- `s` — syllable split for pronunciation, e.g. `SIH · ner · jee` (optional)

Then commit. The widget picks up new words on its next refresh
(usually within an hour). A check runs on every push to make sure
the JSON is still valid — if you break the format, GitHub will
tell you in the Actions tab.
