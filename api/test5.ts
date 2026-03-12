import express from "express";
import { neon } from "@neondatabase/serverless";
import { getContactPrompt } from "../src/lib/prompts";

const app = express();
app.use(express.json());

// No initDB() at module level - init lazily instead

app.get("/api/test5", async (req, res) => {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`CREATE TABLE IF NOT EXISTS records (id TEXT PRIMARY KEY, type TEXT)`;
    const prompt = getContactPrompt("3歳児");
    res.json({ status: "ok", promptLen: prompt.length });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default app;
