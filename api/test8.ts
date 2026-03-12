import express from "express";
import { AGE_OPTIONS } from "../src/lib/guidelines";

const app = express();

app.get("/api/test8", (req, res) => {
  res.json({ status: "ok", ages: AGE_OPTIONS });
});

export default app;
