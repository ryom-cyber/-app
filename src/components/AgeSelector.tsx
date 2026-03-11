"use client";

import { AGE_OPTIONS } from "@/src/lib/guidelines";

type Props = { value: string; onChange: (age: string) => void };

export default function AgeSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-6 gap-1.5 sm:flex sm:gap-2 sm:flex-wrap">
      {AGE_OPTIONS.map((age) => (
        <button
          key={age}
          onClick={() => onChange(age)}
          className="px-1 sm:px-4 py-2 sm:py-2 rounded-2xl text-xs transition-all duration-300 cursor-pointer border-2 active:scale-95 min-h-[40px] sm:min-h-0"
          style={{
            borderColor: value === age ? "#3A8F7B" : "#F0EBE6",
            background: value === age ? "#E6F5F0" : "#FFFFFF",
            color: value === age ? "#1E6B5A" : "#94A3AE",
            fontWeight: value === age ? 700 : 500,
            boxShadow: value === age ? "0 4px 12px rgba(58, 143, 123, 0.1)" : "none",
          }}
        >
          {age}
        </button>
      ))}
    </div>
  );
}
