import express from "express";
import { neon } from "@neondatabase/serverless";

const app = express();
app.use(express.json());

app.get("/api/test2", (req, res) => {
  res.json({ status: "ok", neon: typeof neon });
});

export default app;
