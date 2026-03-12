import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

app.get("/api/test3", (req, res) => {
  res.json({ status: "ok", genai: typeof GoogleGenAI });
});

export default app;
