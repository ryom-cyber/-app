"use client";

import { useState } from "react";
import { Save, Check, Copy } from "lucide-react";
import Markdown from "react-markdown";

type Props = { 
  result: string; 
  color: string;
  type: string;
  age: string;
  metadata: any;
};

export default function ResultBox({ result, color, type, age, metadata }: Props) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!result) return null;

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
        body: JSON.stringify({
          type,
          age,
          title,
          content: result,
          metadata,
        }),
      });
      if (res.ok) {
        setSaved(true);
      }
    } catch (error) {
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

      <div className="relative p-8 rounded-[40px] bg-white border-2 border-[#F0EBE6] shadow-2xl overflow-hidden group">
        {/* Decorative background element */}
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

      <p className="mt-6 text-center text-[10px] text-[#94A3AE] font-medium leading-relaxed">
        ※AIによる生成結果です。必ず内容を確認し、<br/>必要に応じて修正してご使用ください。
      </p>
    </div>
  );
}
