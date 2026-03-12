import express from "express";
import { getContactPrompt } from "../src/lib/prompts";

const app = express();

app.get("/api/test6", (req, res) => {
  try {
    const prompt = getContactPrompt("3歳児");
    res.json({ status: "ok", len: prompt.length });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default app;
