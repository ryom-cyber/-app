import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import Database from "better-sqlite3";
import { getContactPrompt, getDailyPrompt, getWeeklyPrompt } from "./src/lib/prompts";

const db_sqlite = new Database("records.db");

// Initialize database
db_sqlite.exec(`
  CREATE TABLE IF NOT EXISTS records (
    id TEXT PRIMARY KEY,
    type TEXT,
    age TEXT,
    title TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT
  )
`);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // API routes
  app.post("/api/generate", async (req, res) => {
    try {
      const { type, age, activity, observation, concern, month, goal } = req.body;

      let systemPrompt = "";
      let userMessage = "";

      switch (type) {
        case "contact":
          systemPrompt = getContactPrompt(age);
          userMessage = `【年齢】${age}\n【今日の活動】${activity || "（未入力）"}\n【子どもの様子（保育士メモ）】${observation}`;
          break;
        case "daily":
          systemPrompt = getDailyPrompt(age);
          userMessage = `【年齢】${age}\n【予定している活動】${activity}\n【配慮したいこと】${concern || "（特になし）"}`;
          break;
        case "weekly":
          systemPrompt = getWeeklyPrompt(age, month);
          userMessage = `【年齢】${age}\n【月】${month}\n【月案のねらい】${goal}`;
          break;
        default:
          return res.status(400).json({ error: "Invalid type" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      res.json({ result: response.text });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ error: "AIの応答でエラーが発生しました。もう一度お試しください。" });
    }
  });

  // Record management
  app.post("/api/records", (req, res) => {
    const { type, age, title, content, metadata } = req.body;
    const id = Math.random().toString(36).substring(2, 15);
    try {
      const stmt = db_sqlite.prepare("INSERT INTO records (id, type, age, title, content, metadata) VALUES (?, ?, ?, ?, ?, ?)");
      stmt.run(id, type, age, title, content, JSON.stringify(metadata));
      res.json({ id });
    } catch (error) {
      console.error("DB Error:", error);
      res.status(500).json({ error: "保存に失敗しました" });
    }
  });

  app.get("/api/records", (req, res) => {
    try {
      const records = db_sqlite.prepare("SELECT * FROM records ORDER BY created_at DESC").all();
      res.json(records.map(r => ({ ...r, metadata: JSON.parse(r.metadata as string) })));
    } catch (error) {
      res.status(500).json({ error: "取得に失敗しました" });
    }
  });

  app.get("/api/records/:id", (req, res) => {
    try {
      const record = db_sqlite.prepare("SELECT * FROM records WHERE id = ?").get(req.params.id);
      if (!record) return res.status(404).json({ error: "見つかりませんでした" });
      // @ts-ignore
      res.json({ ...record, metadata: JSON.parse(record.metadata as string) });
    } catch (error) {
      res.status(500).json({ error: "取得に失敗しました" });
    }
  });

  app.delete("/api/records/:id", (req, res) => {
    try {
      db_sqlite.prepare("DELETE FROM records WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "削除に失敗しました" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
