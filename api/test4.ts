import express from "express";
import { neon } from "@neondatabase/serverless";
import { getContactPrompt } from "../src/lib/prompts";

const app = express();
app.use(express.json());

// Test: initDB at module level (the same as api/index.ts)
async function initDB() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`CREATE TABLE IF NOT EXISTS records (id TEXT PRIMARY KEY, type TEXT)`;
}
initDB().catch(console.error);

app.get("/api/test4", (req, res) => {
  const prompt = getContactPrompt("3歳児");
  res.json({ status: "ok", promptLen: prompt.length });
});

export default app;
