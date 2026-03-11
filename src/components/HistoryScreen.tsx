"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Share2, ArrowLeft } from "lucide-react";
import Markdown from "react-markdown";

interface SavedRecord {
  id: number;
  type: string;
  age: string;
  content: string;
  created_at: string;
  metadata: any;
}

export default function HistoryScreen() {
  const [records, setRecords] = useState<SavedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<SavedRecord | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/records");
      const data = await res.json();
      setRecords(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get("shared");
    if (sharedId) {
      const fetchShared = async () => {
        try {
          const res = await fetch(`/api/records/${sharedId}`);
          if (res.ok) {
            const data = await res.json();
            setSelectedRecord(data);
          }
        } catch (err) { console.error(err); }
      };
      fetchShared();
    }
    fetchRecords();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("この記録を削除しますか？")) return;
    try {
      await fetch(`/api/records/${id}`, { method: "DELETE" });
      fetchRecords();
      if (selectedRecord?.id === id) setSelectedRecord(null);
    } catch (err) { console.error(err); }
  };

  const handleShare = async (record: SavedRecord) => {
    const shareUrl = `${window.location.origin}?shared=${record.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ほいくAIアシスタント 共有",
          text: `${record.age}児の${record.type === "contact" ? "連絡帳" : record.type === "daily" ? "日案" : "週案"}案です。`,
          url: shareUrl,
        });
      } catch (err) { console.error(err); }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("共有URLをコピーしました！");
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "contact": return "連絡帳";
      case "daily": return "日案";
      case "weekly": return "週案";
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "contact": return "#3A8F7B";
      case "daily": return "#D97B2A";
      case "weekly": return "#7B5EA7";
      default: return "#94A3AE";
    }
  };

  if (selectedRecord) {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setSelectedRecord(null)}
          className="flex items-center gap-2 text-[11px] font-black text-[#94A3AE] uppercase tracking-widest hover:text-[#1A1A1A] transition-colors"
        >
          <ArrowLeft size={14} /> 履歴一覧に戻る
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider" style={{ background: getTypeColor(selectedRecord.type) }}>
              {getTypeName(selectedRecord.type)}
            </span>
            <span className="text-[11px] font-bold text-[#94A3AE] uppercase tracking-widest">
              {selectedRecord.age}
            </span>
          </div>
          <h2 className="text-4xl font-serif italic text-[#1A1A1A] leading-tight">
            {new Date(selectedRecord.created_at).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}の記録
          </h2>
        </div>

        <div className="p-8 rounded-[40px] bg-white border-2 border-[#F0EBE6] shadow-xl">
          <div className="prose prose-sm max-w-none text-[#1A1A1A] leading-relaxed whitespace-pre-wrap font-medium">
            <Markdown>{selectedRecord.content}</Markdown>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => handleShare(selectedRecord)}
            className="flex-1 py-4 rounded-2xl bg-[#FDFCFB] border-2 border-[#F0EBE6] text-[#1A1A1A] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#F0EBE6] transition-all"
          >
            <Share2 size={18} /> 共有する
          </button>
          <button 
            onClick={() => handleDelete(selectedRecord.id)}
            className="w-14 h-14 rounded-2xl bg-[#FFF5F5] text-[#FF4444] flex items-center justify-center hover:bg-[#FFE0E0] transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h2 className="text-5xl font-serif italic text-[#1A1A1A] tracking-tighter">History</h2>
        <p className="text-[11px] font-bold text-[#94A3AE] uppercase tracking-[0.2em]">作成済みの書類アーカイブ</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-4 border-[#F0EBE6] border-t-[#3A8F7B] rounded-full animate-spin" />
          <p className="text-[11px] font-bold text-[#94A3AE] uppercase tracking-widest">読み込み中...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-20 px-10 rounded-[40px] border-2 border-dashed border-[#F0EBE6]">
          <p className="text-sm text-[#94A3AE] font-medium">まだ記録がありません。<br/>書類を作成して保存してみましょう。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div 
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="group relative p-6 rounded-[32px] bg-white border-2 border-[#F0EBE6] hover:border-[#1A1A1A] transition-all duration-500 cursor-pointer overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: getTypeColor(record.type) }} />
                  <span className="text-[10px] font-black text-[#94A3AE] uppercase tracking-widest">
                    {getTypeName(record.type)} / {record.age}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#94A3AE]">
                  {new Date(record.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
              
              <h3 className="text-xl font-serif italic text-[#1A1A1A] mb-2 group-hover:translate-x-1 transition-transform duration-500">
                {record.content.split('\n')[0].replace(/[#*]/g, '').substring(0, 20)}...
              </h3>
              
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#3A8F7B] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                View Details <ArrowLeft size={12} className="rotate-180" />
              </div>

              {/* Decorative element */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#FDFCFB] rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 -z-10" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
