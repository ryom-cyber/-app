"use client";

import { useState } from "react";
import AgeSelector from "./AgeSelector";
import ResultBox from "./ResultBox";

export default function DailyScreen() {
  const [age, setAge] = useState("");
  const [activity, setActivity] = useState("");
  const [concern, setConcern] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!age || !activity) return;
    setLoading(true); setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "daily", age, activity, concern }),
      });
      const data = await res.json();
      setResult(data.result || data.error || "エラーが発生しました。");
    } catch { setResult("通信エラーが発生しました。"); }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-8">
      <div className="p-2.5 sm:p-5 rounded-xl sm:rounded-3xl bg-[#FFF3E5] text-[#A0611A] text-xs sm:text-[11px] leading-relaxed font-medium border border-[#D97B2A]/10 flex items-start gap-2">
        <span className="text-base sm:text-lg shrink-0">💡</span>
        <span>先生が考えた活動と配慮を入力してください。先生の意図を保育指針の表現に整えて、日案のフォーマットに仕上げます。</span>
      </div>

      <div className="space-y-3 sm:space-y-6">
        <section>
          <label className="text-[10px] sm:text-[11px] font-black text-[#94A3AE] uppercase tracking-widest mb-1.5 sm:mb-3 block">
            01. 対象の年齢 <span className="text-[#F0A050] ml-1">*</span>
          </label>
          <AgeSelector value={age} onChange={setAge} />
        </section>

        <section>
          <label className="text-[10px] sm:text-[11px] font-black text-[#94A3AE] uppercase tracking-widest mb-1.5 sm:mb-3 block">
            02. 予定している活動 <span className="text-[#F0A050] ml-1">*</span>
          </label>
          <textarea
            placeholder={`例：園庭で水遊び（タライ、ジョウロ等を用意）\nこの活動で子どもにどんな姿を期待しているかも書いてもらえると、より先生の意図に沿った提案ができます`}
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            rows={2}
            className="w-full p-3 sm:p-4 rounded-2xl border-2 border-[#F0EBE6] bg-[#FDFCFB] text-sm text-[#1A1A1A] outline-none focus:border-[#D97B2A] transition-all placeholder:text-[#94A3AE]/50 font-medium leading-relaxed"
          />
        </section>

        <section>
          <label className="text-[10px] sm:text-[11px] font-black text-[#94A3AE] uppercase tracking-widest mb-1.5 sm:mb-3 block">
            03. 配慮したいこと
          </label>
          <textarea
            placeholder="例：水が苦手な子がいる、暑さ対策が必要"
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            rows={2}
            className="w-full p-3 sm:p-4 rounded-2xl border-2 border-[#F0EBE6] bg-[#FDFCFB] text-sm text-[#1A1A1A] outline-none focus:border-[#D97B2A] transition-all placeholder:text-[#94A3AE]/50 font-medium"
          />
        </section>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !age || !activity}
        className="w-full py-3.5 sm:py-5 rounded-[24px] text-white font-bold text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-50 cursor-pointer shadow-lg active:scale-[0.98]"
        style={{ background: loading ? "#94A3AE" : "linear-gradient(135deg, #D97B2A 0%, #B86218 100%)" }}
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 作成中...</>
        ) : (
          <>✨ 日案のねらいを作成</>
        )}
      </button>

      <ResultBox
        result={result}
        color="#D97B2A"
        type="daily"
        age={age}
        metadata={{ activity, concern }}
      />
    </div>
  );
}
