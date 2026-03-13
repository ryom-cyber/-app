"use client";

import { useState } from "react";
import AgeSelector from "./AgeSelector";
import ResultBox from "./ResultBox";

export default function ContactScreen() {
  const [age, setAge] = useState("");
  const [activity, setActivity] = useState("");
  const [observation, setObservation] = useState("");
  const [result, setResult] = useState("");
  const [developmentalNotes, setDevelopmentalNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!age || !observation) return;
    setLoading(true); setResult(""); setDevelopmentalNotes("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", age, activity, observation }),
      });
      const data = await res.json();
      setResult(data.result || data.error || "エラーが発生しました。");
      setDevelopmentalNotes(data.developmentalNotes || "");
    } catch { setResult("通信エラーが発生しました。"); }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-8">
      <div className="p-2.5 sm:p-5 rounded-xl sm:rounded-3xl bg-[#E6F5F0] text-[#1E6B5A] text-xs sm:text-[11px] leading-relaxed font-medium border border-[#3A8F7B]/10 flex items-start gap-2">
        <span className="text-base sm:text-lg shrink-0">💡</span>
        <span>先生が見た子どもの様子をメモで入力してください。保育所保育指針の発達の視点を踏まえ、保護者向けの連絡帳文章に仕上げます。</span>
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
            02. 今日の主な活動
          </label>
          <textarea
            placeholder="例：砂場遊び、散歩で公園へ、製作活動"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            rows={2}
            className="w-full p-3 sm:p-4 rounded-2xl border-2 border-[#F0EBE6] bg-[#FDFCFB] text-sm text-[#1A1A1A] outline-none focus:border-[#3A8F7B] transition-all placeholder:text-[#94A3AE]/50 font-medium"
          />
        </section>

        <section>
          <label className="text-[10px] sm:text-[11px] font-black text-[#94A3AE] uppercase tracking-widest mb-1.5 sm:mb-3 block">
            03. 子どもの様子 <span className="text-[#F0A050] ml-1">*</span>
          </label>
          <textarea
            placeholder={`例：たっくん、砂場でスコップをゆうちゃんに「はい、どーぞ」って自分から貸してた。最近取り合い多かったけど今日は自分から。すごく嬉しそうな顔してた。`}
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            rows={4}
            className="w-full p-3 sm:p-4 rounded-2xl border-2 border-[#F0EBE6] bg-[#FDFCFB] text-sm text-[#1A1A1A] outline-none focus:border-[#3A8F7B] transition-all placeholder:text-[#94A3AE]/50 font-medium leading-relaxed"
          />
        </section>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !age || !observation}
        className="w-full py-3.5 sm:py-5 rounded-[24px] text-white font-bold text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-50 cursor-pointer shadow-lg active:scale-[0.98]"
        style={{ background: loading ? "#94A3AE" : "linear-gradient(135deg, #3A8F7B 0%, #2D6E5F 100%)" }}
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 作成中...</>
        ) : (
          <>✨ 連絡帳の文章を作成</>
        )}
      </button>

      <ResultBox
        result={result}
        color="#3A8F7B"
        type="contact"
        age={age}
        metadata={{ activity, observation }}
        developmentalNotes={developmentalNotes}
      />
    </div>
  );
}
