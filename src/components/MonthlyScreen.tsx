"use client";

import { useState } from "react";
import AgeSelector from "./AgeSelector";
import ResultBox from "./ResultBox";
import { MONTH_OPTIONS } from "@/src/lib/guidelines";

// 月案の生成結果から「今月のねらい」部分を抽出
const extractGoals = (result: string): string => {
  // 「---」の前のメインテキストだけを対象に
  const mainText = result.split("---")[0] || result;
  const match = mainText.match(/【今月のねらい】([\s\S]*?)(?=【内容】|$)/);
  return match ? match[1].trim() : "";
};

type Props = {
  onToWeekly: (age: string, month: string, goals: string) => void;
};

export default function MonthlyScreen({ onToWeekly }: Props) {
  const [age, setAge] = useState("");
  const [month, setMonth] = useState("");
  const [prevReview, setPrevReview] = useState("");
  const [theme, setTheme] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const color = "#2E86C1";

  const handleGenerate = async () => {
    if (!age || !month) return;
    setLoading(true); setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "monthly", age, month, prevReview, theme }),
      });
      const data = await res.json();
      setResult(data.result || data.error || "エラーが発生しました。");
    } catch { setResult("通信エラーが発生しました。"); }
    setLoading(false);
  };

  const handleToWeekly = () => {
    const goals = extractGoals(result);
    onToWeekly(age, month, goals);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-8">
      <div
        className="p-2.5 sm:p-5 rounded-xl sm:rounded-3xl text-xs sm:text-[11px] leading-relaxed font-medium border flex items-start gap-2"
        style={{ background: "#EBF5FB", color: "#1A5276", borderColor: `${color}20` }}
      >
        <span className="text-base sm:text-lg shrink-0">💡</span>
        <span>
          年齢と月を選び、前月の振り返りを入力してください。先生の振り返りをもとに、保育指針に沿った月案を作成します。生成後、そのまま週案に展開できます。
        </span>
      </div>

      <div className="space-y-3 sm:space-y-6">
        {/* 年齢 */}
        <section>
          <label className="text-[10px] sm:text-[11px] font-black text-[#94A3AE] uppercase tracking-widest mb-1.5 sm:mb-3 block">
            01. 対象の年齢 <span className="text-[#F0A050] ml-1">*</span>
          </label>
          <AgeSelector value={age} onChange={setAge} />
        </section>

        {/* 対象月 */}
        <section>
          <label className="text-[10px] sm:text-[11px] font-black text-[#94A3AE] uppercase tracking-widest mb-1.5 sm:mb-3 block">
            02. 対象月 <span className="text-[#F0A050] ml-1">*</span>
          </label>
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {MONTH_OPTIONS.map((m) => (
              <button
                key={m}
                onClick={() => setMonth(m)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs transition-all cursor-pointer border-2 active:scale-95 min-h-[40px] sm:min-h-[44px]"
                style={{
                  borderColor: month === m ? color : "#F0EBE6",
                  background: month === m ? "#EBF5FB" : "#FFFFFF",
                  color: month === m ? color : "#94A3AE",
                  fontWeight: month === m ? 700 : 500,
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </section>

        {/* 前月の振り返り */}
        <section>
          <label className="text-[10px] sm:text-[11px] font-black text-[#94A3AE] uppercase tracking-widest mb-1.5 sm:mb-3 block">
            03. 前月の子どもの姿・振り返り
          </label>
          <textarea
            placeholder="例：友達との関わりが増えてきたが、まだ自分の思いを言葉にするのが難しい子もいる。戸外遊びでは虫や花に興味を示す子が多かった。"
            value={prevReview}
            onChange={(e) => setPrevReview(e.target.value)}
            rows={4}
            className="w-full p-3 sm:p-4 rounded-2xl border-2 border-[#F0EBE6] bg-[#FDFCFB] text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-[#94A3AE]/50 font-medium leading-relaxed"
            onFocus={(e) => (e.target.style.borderColor = color)}
            onBlur={(e) => (e.target.style.borderColor = "#F0EBE6")}
          />
        </section>

        {/* 園のテーマ・行事 */}
        <section>
          <label className="text-[10px] sm:text-[11px] font-black text-[#94A3AE] uppercase tracking-widest mb-1.5 sm:mb-3 block">
            04. 園の重点テーマ・行事予定
          </label>
          <textarea
            placeholder="例：食育月間、遠足（15日）、自然保育を大切にしている園"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            rows={2}
            className="w-full p-3 sm:p-4 rounded-2xl border-2 border-[#F0EBE6] bg-[#FDFCFB] text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-[#94A3AE]/50 font-medium"
            onFocus={(e) => (e.target.style.borderColor = color)}
            onBlur={(e) => (e.target.style.borderColor = "#F0EBE6")}
          />
        </section>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !age || !month}
        className="w-full py-3.5 sm:py-5 rounded-[24px] text-white font-bold text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-50 cursor-pointer shadow-lg active:scale-[0.98]"
        style={{ background: loading ? "#94A3AE" : `linear-gradient(135deg, ${color} 0%, #1A5276 100%)` }}
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 作成中...</>
        ) : (
          <>✨ 月案を作成</>
        )}
      </button>

      {result && (
        <>
          <ResultBox
            result={result}
            color={color}
            type="monthly"
            age={age}
            metadata={{ month, prevReview, theme }}
          />

          {/* 週案に展開ボタン */}
          <button
            onClick={handleToWeekly}
            className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer border-2"
            style={{ borderColor: "#7B5EA7", color: "#7B5EA7", background: "#FDFCFB" }}
          >
            <span>📆</span>
            <span>この月案から週案を作る →</span>
          </button>
        </>
      )}
    </div>
  );
}
