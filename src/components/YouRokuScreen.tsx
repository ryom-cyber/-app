"use client";

import { useState } from "react";
import ResultBox from "./ResultBox";

export default function YouRokuScreen() {
  const [childName, setChildName] = useState("");
  const [episode, setEpisode] = useState("");
  const [growth, setGrowth] = useState("");
  const [handover, setHandover] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!episode) return;
    setLoading(true); setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "youroku", childName, episode, growth, handover }),
      });
      const data = await res.json();
      setResult(data.result || data.error || "エラーが発生しました。");
    } catch { setResult("通信エラーが発生しました。"); }
    setLoading(false);
  };

  const color = "#C4871A";

  return (
    <div className="flex flex-col gap-3 sm:gap-8">
      {/* Info Banner */}
      <div className="p-2.5 sm:p-5 rounded-xl sm:rounded-3xl text-xs sm:text-[11px] leading-relaxed font-medium border flex items-start gap-2"
        style={{ background: "#FEF7EC", color: "#7A4F0E", borderColor: `${color}20` }}>
        <span className="text-base sm:text-lg shrink-0">📋</span>
        <span>
          5歳児クラス（年長）の1年間のエピソードを入力してください。保育所保育指針の5領域と「幼児期の終わりまでに育ってほしい10の姿」をもとに、保育要録（保育に関する記録）の文章を生成します。
        </span>
      </div>

      <div className="space-y-3 sm:space-y-6">
        {/* 子どもの呼び名 */}
        <section>
          <label className="text-[10px] sm:text-[11px] font-black text-[#94A3AE] uppercase tracking-widest mb-1.5 sm:mb-3 block">
            01. 子どもの呼び名（任意）
          </label>
          <input
            type="text"
            placeholder="例：Aちゃん、○○くん（文中に使用。省略可）"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            className="w-full p-3 sm:p-4 rounded-2xl border-2 border-[#F0EBE6] bg-[#FDFCFB] text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-[#94A3AE]/50 font-medium"
            style={{ '--tw-ring-color': color } as React.CSSProperties}
            onFocus={e => e.target.style.borderColor = color}
            onBlur={e => e.target.style.borderColor = '#F0EBE6'}
          />
        </section>

        {/* 1年間の様子・エピソード */}
        <section>
          <label className="text-[10px] sm:text-[11px] font-black text-[#94A3AE] uppercase tracking-widest mb-1.5 sm:mb-3 block">
            02. 1年間の様子・エピソード <span className="text-[#F0A050] ml-1">*</span>
          </label>
          <textarea
            placeholder={`例：
入園当初は集団活動に馴染むのに時間がかかっていたが、友達と遊ぶ楽しさに気づき、積極的に関わるようになった。製作が得意で、自分のイメージを形にすることに集中して取り組む。運動会のリレーでは転んだ友達を励ます姿が見られた。言葉で気持ちを伝えることが上手になり、トラブルも自分たちで解決できることが増えた。`}
            value={episode}
            onChange={(e) => setEpisode(e.target.value)}
            rows={6}
            className="w-full p-3 sm:p-4 rounded-2xl border-2 border-[#F0EBE6] bg-[#FDFCFB] text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-[#94A3AE]/50 font-medium leading-relaxed"
            onFocus={e => e.target.style.borderColor = color}
            onBlur={e => e.target.style.borderColor = '#F0EBE6'}
          />
        </section>

        {/* 特に成長が見られた点 */}
        <section>
          <label className="text-[10px] sm:text-[11px] font-black text-[#94A3AE] uppercase tracking-widest mb-1.5 sm:mb-3 block">
            03. 特に成長が見られた点（任意）
          </label>
          <textarea
            placeholder="例：友達との関わり方、言葉の表現力、自己調整力、集中力など"
            value={growth}
            onChange={(e) => setGrowth(e.target.value)}
            rows={3}
            className="w-full p-3 sm:p-4 rounded-2xl border-2 border-[#F0EBE6] bg-[#FDFCFB] text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-[#94A3AE]/50 font-medium leading-relaxed"
            onFocus={e => e.target.style.borderColor = color}
            onBlur={e => e.target.style.borderColor = '#F0EBE6'}
          />
        </section>

        {/* 小学校への引き継ぎ事項 */}
        <section>
          <label className="text-[10px] sm:text-[11px] font-black text-[#94A3AE] uppercase tracking-widest mb-1.5 sm:mb-3 block">
            04. 小学校への引き継ぎ事項（任意）
          </label>
          <textarea
            placeholder="例：大きな音が苦手、切り替えに時間がかかることがある、特定の食物アレルギーあり"
            value={handover}
            onChange={(e) => setHandover(e.target.value)}
            rows={3}
            className="w-full p-3 sm:p-4 rounded-2xl border-2 border-[#F0EBE6] bg-[#FDFCFB] text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-[#94A3AE]/50 font-medium leading-relaxed"
            onFocus={e => e.target.style.borderColor = color}
            onBlur={e => e.target.style.borderColor = '#F0EBE6'}
          />
        </section>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !episode}
        className="w-full py-3.5 sm:py-5 rounded-[24px] text-white font-bold text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-50 cursor-pointer shadow-lg active:scale-[0.98]"
        style={{ background: loading ? "#94A3AE" : `linear-gradient(135deg, ${color} 0%, #7A4F0E 100%)` }}
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 作成中...</>
        ) : (
          <>📋 要録の文章を作成</>
        )}
      </button>

      <ResultBox
        result={result}
        color={color}
        type="youroku"
        age="5歳児"
        metadata={{ childName, episode, growth, handover }}
      />
    </div>
  );
}
