"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ContactScreen from "./components/ContactScreen";
import DailyScreen from "./components/DailyScreen";
import WeeklyScreen from "./components/WeeklyScreen";
import HistoryScreen from "./components/HistoryScreen";
import { History, Layout, Calendar, MessageSquare } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("contact");
  const [isSharedView, setIsSharedView] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("shared")) {
      setIsSharedView(true);
      setActiveTab("history");
    }
  }, []);

  const tabs = [
    { id: "contact", label: "連絡帳", icon: <MessageSquare size={20} />, color: "#3A8F7B" },
    { id: "daily", label: "日案", icon: <Calendar size={20} />, color: "#D97B2A" },
    { id: "weekly", label: "週案", icon: <Layout size={20} />, color: "#7B5EA7" },
    { id: "history", label: "履歴", icon: <History size={20} />, color: "#1A1A1A" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans selection:bg-[#E6F5F0]">
      {/* Editorial Header */}
      <header className="pt-3 pb-3 px-4 sm:pt-12 sm:pb-8 sm:px-6 max-w-2xl mx-auto border-b border-[#F0EBE6]">
        <div className="flex justify-between items-center sm:items-end">
          <div className="space-y-0.5">
            <h1 className="text-3xl sm:text-5xl font-serif italic tracking-tighter leading-none">Hoiku AI</h1>
            <p className="text-[10px] sm:text-[11px] font-black text-[#94A3AE] uppercase tracking-[0.3em]">Professional Assistant</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-[#94A3AE] uppercase tracking-widest">Version 2.0</p>
            <p className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">Prototype</p>
          </div>
        </div>
      </header>

      {/* Main Content — pb accounts for nav (64px) + safe-area + buffer */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 sm:pt-12 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === "contact" && <ContactScreen />}
            {activeTab === "daily" && <DailyScreen />}
            {activeTab === "weekly" && <WeeklyScreen />}
            {activeTab === "history" && <HistoryScreen />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-[#F0EBE6]"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
      >
        <div className="max-w-2xl mx-auto flex justify-around items-center h-14 sm:h-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsSharedView(false);
              }}
              className="relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 group cursor-pointer"
            >
              {/* Active background highlight */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-x-2 inset-y-1 rounded-2xl"
                  style={{ background: `${tab.color}10` }}
                />
              )}
              <div
                className="mb-0.5 transition-transform duration-300 group-active:scale-75 relative z-10"
                style={{ color: activeTab === tab.id ? tab.color : "#94A3AE" }}
              >
                {tab.icon}
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-widest transition-all duration-300 relative z-10 ${activeTab === tab.id ? "opacity-100" : "opacity-40"}`}
                style={{ color: activeTab === tab.id ? tab.color : "#94A3AE" }}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#E6F5F0] rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F3EEF8] rounded-full blur-[120px] opacity-50" />
      </div>
    </div>
  );
}
