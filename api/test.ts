export default function handler(req: any, res: any) {
  res.json({
    status: "ok",
    node: process.version,
    env_gemini: !!process.env.GEMINI_API_KEY,
    env_db: !!process.env.DATABASE_URL,
  });
}
