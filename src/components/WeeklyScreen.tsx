"use client";

import { useState } from "react";
import AgeSelector from "./AgeSelector";
import ResultBox from "./ResultBox";
import { MONTH_OPTIONS } from "@/src/lib/guidelines";

export default function WeeklyScreen() {
  const [age, setAge] = useState("");
  const [month, setMonth] = useState("");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState("");
  const [developmentalNotes, setDevelopmentalNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!age || !month || !goal) return;
    setLoading(true); setResult(""); setDevelopmentalNotes("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "weekly", age, month, goal }),
      });
      const data = await res.json();
      setResult(data.result || data.error || "エラーが発生しました。");
      setDevelopmentalNotes(data.developmentalNotes || "");
    } catch { setResult("通信エラーが発生しました。"); }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-8">
      <div className="p-2.5 sm:p-5 rounded-xl sm:rounded-3xl bg-[#F3EEF8] text-[#5A3D7A] text-xs sm:text-[11px] leading-relaxed font-medium border border-[#7B5EA7]/10 flex items-start gap-2">
        <span className="text-base sm:text-lg shrink-0">💡</span>
        <span>月案のねらいを入力すると、保育所保育指針に沿って4週間分の週案に展開します。書類間の「ダブり」を減らせます。</span>
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
            02. 対象月 <span className="text-[#F0A050] ml-1">*</span>
          </label>
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {MONTH_OPTIONS.map((m) => (
              <button key={m} onClick={() => setMonth(m)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs transition-all cursor-pointer border-2 active:scale-95 min-h-[40px] sm:min-h-[44px]"
                style={{
                  borderColor: month === m ? "#7B5EA7" : "#F0EBE6",
                  background: month === m ? "#F3EEF8" : "#FFFFFF",
                  color: month === m ? "#7B5EA7" : "#94A3AE",
                  fontWeight: month === m ? 700 : 500,
                }}>{m}</button>
            ))}
          </div>
        </section>

        <section>
          <label className="text-[10px] sm:text-[11px] font-black text-[#94A3AE] uppercase tracking-widest mb-1.5 sm:mb-3 block">
            03. 月案のねらい <span className="text-[#F0A050] ml-1">*</span>
          </label>
          <textarea
            placeholder={`例：友達と一緒に体を動かす遊びを楽しみ、ルールのある遊びに興味をもつ`}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
            className="w-full p-3 sm:p-4 rounded-2xl border-2 border-[#F0EBE6] bg-[#FDFCFB] text-sm text-[#1A1A1A] outline-none focus:border-[#7B5EA7] transition-all placeholder:text-[#94A3AE]/50 font-medium leading-relaxed"
          />
        </section>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !age || !month || !goal}
        className="w-full py-3.5 sm:py-5 rounded-[24px] text-white font-bold text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-50 cursor-pointer shadow-lg active:scale-[0.98]"
        style={{ background: loading ? "#94A3AE" : "linear-gradient(135deg, #7B5EA7 0%, #5A3D7A 100%)" }}
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 作成中...</>
        ) : (
          <>✨ 週案に展開</>
        )}
      </button>

      <ResultBox
        result={result}
        color="#7B5EA7"
        type="weekly"
        age={age}
        metadata={{ month, goal }}
        developmentalNotes={developmentalNotes}
      />
    </div>
  );
}
