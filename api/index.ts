import express from "express";
import { neon } from "@neondatabase/serverless";
import { GoogleGenAI } from "@google/genai";
import { getContactPrompt, getDailyPrompt, getWeeklyPrompt } from "./prompts";

const app = express();
app.use(express.json());

function getSql() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  return neon(process.env.DATABASE_URL);
}

async function initDB() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY,
      type TEXT,
      age TEXT,
      title TEXT,
      content TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      metadata TEXT
    )
  `;
}

initDB().catch(console.error);

// AI生成
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
      model: "gemini-2.0-flash",
      contents: userMessage,
      config: { systemInstruction: systemPrompt },
    });

    res.json({ result: response.text });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "AIの応答でエラーが発生しました。もう一度お試しください。" });
  }
});

// 記録を保存
app.post("/api/records", async (req, res) => {
  const { type, age, title, content, metadata } = req.body;
  const id = Math.random().toString(36).substring(2, 15);
  try {
    const sql = getSql();
    await sql`
      INSERT INTO records (id, type, age, title, content, metadata)
      VALUES (${id}, ${type}, ${age}, ${title}, ${content}, ${JSON.stringify(metadata)})
    `;
    res.json({ id });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ error: "保存に失敗しました" });
  }
});

// 記録一覧を取得
app.get("/api/records", async (req, res) => {
  try {
    const sql = getSql();
    const records = await sql`SELECT * FROM records ORDER BY created_at DESC`;
    res.json(records.map(r => ({ ...r, metadata: JSON.parse(r.metadata as string) })));
  } catch (error) {
    res.status(500).json({ error: "取得に失敗しました" });
  }
});

// 記録を1件取得
app.get("/api/records/:id", async (req, res) => {
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM records WHERE id = ${req.params.id}`;
    const record = rows[0];
    if (!record) return res.status(404).json({ error: "見つかりませんでした" });
    res.json({ ...record, metadata: JSON.parse(record.metadata as string) });
  } catch (error) {
    res.status(500).json({ error: "取得に失敗しました" });
  }
});

// 記録を削除
app.delete("/api/records/:id", async (req, res) => {
  try {
    const sql = getSql();
    await sql`DELETE FROM records WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "削除に失敗しました" });
  }
});

export default app;
