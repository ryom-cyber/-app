"use client";

import { useState, useEffect } from "react";
import { Save, Check, Copy, ChevronDown, ChevronRight } from "lucide-react";
import Markdown from "react-markdown";

// チェックポイント（画面タイプごとに定義）
const CHECKPOINTS: Record<string, { label: string; items: string[] }> = {
  contact: {
    label: "連絡帳の確認ポイント",
    items: [
      "子どもの様子が具体的に伝わるか",
      "保護者が読んで温かい気持ちになれる内容か",
      "事実のみで、推測や過剰な表現はないか",
      "200〜300文字程度に収まっているか",
    ],
  },
  daily: {
    label: "日案の確認ポイント",
    items: [
      "ねらいは子どもの姿として具体的に書かれているか",
      "5領域（0歳児は3つの視点）との関連が示されているか",
      "安全面への配慮が含まれているか",
      "子どもが主体になる援助の表現になっているか",
    ],
  },
  weekly: {
    label: "週案の確認ポイント",
    items: [
      "4週間で段階的な展開になっているか",
      "季節・行事との連動が取れているか",
      "月案のねらいと整合しているか",
      "各週の活動は実際の保育で実践しやすいか",
    ],
  },
  youroku: {
    label: "要録の確認ポイント",
    items: [
      "5領域（健康・人間関係・環境・言葉・表現）の視点が入っているか",
      "幼児期の終わりまでに育ってほしい姿が反映されているか",
      "小学校の先生が読んで分かりやすい文体になっているか",
      "子どもの強みを中心に肯定的に書かれているか",
    ],
  },
};

type Props = {
  result: string;
  color: string;
  type: string;
  age: string;
  metadata: any;
  developmentalNotes?: string;
};

export default function ResultBox({ result, color, type, age, metadata, developmentalNotes }: Props) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // 発達の視点：デフォルト閉じ
  const [notesExpanded, setNotesExpanded] = useState(false);

  // チェックポイント：初回は展開表示、2回目以降は折りたたみ
  const seenKey = `hk_cp_${type}`;
  const [isFirstTime] = useState<boolean>(() => {
    try { return localStorage.getItem(seenKey) !== "1"; } catch { return true; }
  });
  const [checkpointExpanded, setCheckpointExpanded] = useState<boolean>(() => {
    try { return localStorage.getItem(seenKey) !== "1"; } catch { return true; }
  });

  // 初回表示後にlocalStorageへ記録（次回はコンパクト表示に）
  useEffect(() => {
    if (isFirstTime) {
      try { localStorage.setItem(seenKey, "1"); } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!result) return null;

  const checkpoint = CHECKPOINTS[type];

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (saved || saving) return;
    setSaving(true);
    try {
      const title = result.split("\n")[0].substring(0, 30) || `${type} (${age})`;
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, age, title, content: result, metadata }),
      });
      if (res.ok) setSaved(true);
    } catch {
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-[1px] flex-1 bg-[#F0EBE6]" />
        <span className="text-[11px] font-black text-[#94A3AE] uppercase tracking-[0.3em]">Generated Result</span>
        <div className="h-[1px] flex-1 bg-[#F0EBE6]" />
      </div>

      {/* メイン生成結果 */}
      <div className="relative p-8 rounded-[40px] bg-white border-2 border-[#F0EBE6] shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDFCFB] rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

        <div className="relative z-10 prose prose-sm max-w-none text-[#1A1A1A] leading-relaxed whitespace-pre-wrap font-medium">
          <Markdown>{result}</Markdown>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 relative z-10">
          <button
            onClick={handleCopy}
            className="flex-1 py-4 rounded-2xl bg-[#FDFCFB] border-2 border-[#F0EBE6] text-[#1A1A1A] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#F0EBE6] transition-all active:scale-[0.98] cursor-pointer"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "コピー完了" : "テキストをコピー"}
          </button>
          <button
            onClick={handleSave}
            disabled={saved || saving}
            className="flex-1 py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg cursor-pointer"
            style={{ background: saved ? "#94A3AE" : `linear-gradient(135deg, ${color} 0%, #1A1A1A 100%)` }}
          >
            {saved ? <Check size={18} /> : <Save size={18} />}
            {saved ? "保存済み" : saving ? "保存中..." : "履歴に保存"}
          </button>
        </div>
      </div>

      {/* ─── チェックポイント ─── */}
      {checkpoint && (
        isFirstTime ? (
          /* 初回：カード全表示（施設長への説得材料としても機能） */
          <div className="mt-4 p-5 rounded-2xl border-2" style={{ borderColor: `${color}30`, background: `${color}08` }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">✅</span>
              <span className="text-sm font-bold text-[#1A1A1A]">{checkpoint.label}</span>
            </div>
            <ul className="space-y-2.5">
              {checkpoint.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#3A3A3A]">
                  <span className="shrink-0 mt-0.5 text-[#94A3AE]">□</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          /* 2回目以降：コンパクト折りたたみ */
          <div className="mt-3">
            <button
              onClick={() => setCheckpointExpanded(!checkpointExpanded)}
              className="flex items-center gap-1.5 text-[11px] text-[#94A3AE] font-medium border border-[#F0EBE6] rounded-xl px-3 py-2 hover:border-[#DDD] transition-all cursor-pointer"
            >
              <span>✅</span>
              <span>{checkpoint.label}（{checkpoint.items.length}項目）</span>
              {checkpointExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
            {checkpointExpanded && (
              <ul className="mt-2 pl-2 space-y-1.5">
                {checkpoint.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#94A3AE]">
                    <span className="shrink-0">□</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      )}

      {/* ─── 発達の視点（折りたたみ、デフォルト閉じ） ─── */}
      {developmentalNotes && (
        <div className="mt-3">
          <button
            onClick={() => setNotesExpanded(!notesExpanded)}
            className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            style={{ color }}
          >
            {notesExpanded
              ? <ChevronDown size={14} />
              : <ChevronRight size={14} />
            }
            <span>発達の視点を見る</span>
          </button>
          {notesExpanded && (
            <div
              className="mt-2 p-4 rounded-2xl text-sm leading-relaxed text-[#3A3A3A]"
              style={{ background: `${color}08`, borderLeft: `3px solid ${color}40` }}
            >
              {developmentalNotes}
            </div>
          )}
        </div>
      )}

      <p className="mt-6 text-center text-[10px] text-[#94A3AE] font-medium leading-relaxed">
        ※AIによる生成結果です。必ず内容を確認し、<br />必要に応じて修正してご使用ください。
      </p>
    </div>
  );
}
