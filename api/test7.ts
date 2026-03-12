import express from "express";

const app = express();

// Inline Japanese text (like guidelines.ts would have)
const testText = "友達と一緒に体を動かす遊びを楽しみ、ルールのある遊びに興味をもつ";

app.get("/api/test7", (req, res) => {
  res.json({ status: "ok", text: testText.substring(0, 10) });
});

export default app;
