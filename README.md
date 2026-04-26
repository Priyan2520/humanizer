# ✍️ Humanizer

> *Turn robotic, AI-generated, or overly formal text into warm, conversational language — instantly.*

```
[🤖 Original]                          [😊 Humanized]
──────────────────────────────────────────────────────
"I am writing to inform you that       "I'm letting you know that things
the aforementioned task has been        are done and went really well,
completed in a satisfactory manner."    honestly."
```

---

## ✨ Features

| Feature | Details |
|---|---|
| **Smart Rule Engine** | 100+ contractions, casual swaps, formality-busters |
| **Persistent History** | Every transformation saved to MongoDB with stats |
| **Copy & Re-edit** | One-click copy or load original back into the editor |
| **Live Character Counter** | Warns at 200 chars remaining, blocks at 5000 |
| **Paste Button** | Reads from clipboard directly in the UI |
| **Transform Stats** | Shows # of swaps and character delta per entry |
| **Rate Limiting** | 30 req/min per IP — keeps things friendly |
| **Input Validation** | Server-side with express-validator |
| **Responsive** | Mobile-first, works on all screen sizes |
| **Warm Aesthetic** | Playfair Display + DM Sans, cream/amber palette |

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| **Frontend** | React 18, Vite, TailwindCSS, Axios |
| **Backend** | Node.js 18+, Express 4, Mongoose 7 |
| **Database** | MongoDB (local or Atlas) |
| **Dev** | Nodemon, express-rate-limit, express-validator |

---

## 📁 Project Structure

```
humanizer/
├── backend/
│   ├── config/db.js            # Mongoose connection
│   ├── models/Entry.js         # Entry schema (originalText, humanizedText, stats)
│   ├── routes/api.js           # POST /humanize  GET /entries  DELETE /entries/:id
│   ├── services/humanizer.js   # 🧠 The engine — 100+ rule-based transformations
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/client.js           # Axios wrapper
│   │   ├── components/
│   │   │   ├── HumanizerForm.jsx   # Textarea, paste, submit with animations
│   │   │   ├── HistoryList.jsx     # Expandable history cards
│   │   │   └── AnimatedBadge.jsx   # Sparkle ✨ badge
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css               # Tailwind + custom component classes
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── postcss.config.js
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or later
- **MongoDB** running locally **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

### 1 · Clone

```bash
git clone https://github.com/Priyan2520/humanizer.git
cd humanizer
```

### 2 · Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGODB_URI (default: mongodb://localhost:27017/humanizer)

npm install
npm run dev        # → http://localhost:5000
```

### 3 · Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

### 4 · Open the app

Visit **http://localhost:5173** — you're live!

---

## 🗄 MongoDB Setup

**Local (recommended for dev):**
```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod
```

**Cloud (Atlas):**
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Copy your connection string
3. Set `MONGODB_URI=mongodb+srv://...` in `backend/.env`

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/humanize` | Humanize text, save to DB |
| `GET` | `/api/entries` | Fetch last 50 entries |
| `DELETE` | `/api/entries/:id` | Delete one entry |
| `DELETE` | `/api/entries` | Clear all entries |
| `GET` | `/health` | Server health check |

**POST /api/humanize** request body:
```json
{ "text": "I am very happy to see you. Therefore, I think we should celebrate." }
```

Response:
```json
{
  "success": true,
  "humanizedText": "I'm super happy to see you. So, I feel like we should celebrate.",
  "transformCount": 4,
  "charDelta": -2,
  "entry": { "_id": "...", "createdAt": "..." }
}
```

---

## 🧠 How the Humanizer Engine Works

The engine in `backend/services/humanizer.js` applies three layers of transformation:

1. **Contractions** — `"I am"` → `"I'm"`, `"cannot"` → `"can't"`, etc. (40+ rules)
2. **Casual Swaps** — `"Therefore"` → `"So,"`, `"utilize"` → `"use"`, `"excellent"` → `"awesome"` (60+ rules)
3. **Trailing Phrases** — ~30% of entries get a natural coda like `", you know?"` or `" — just saying."` (deterministic, based on text hash)

All rules are regex-based — no external API, no internet required, works fully offline.

---

## 🏗 Production Build

```bash
# Build frontend
cd frontend && npm run build

# Serve with express (add this to backend/server.js for production):
# app.use(express.static(path.join(__dirname, '../frontend/dist')))

# Or deploy separately (Vercel for frontend, Railway/Render for backend)
```

---

## 🤝 Contributing

Pull requests welcome! For major changes, open an issue first to discuss.

```bash
# Fork → clone → branch → PR
git checkout -b feat/my-improvement
```

---

## 📄 License

[MIT](LICENSE)

---

*Hand-made with ☕ and kindness — by [Priyan2520](https://github.com/Priyan2520)*
