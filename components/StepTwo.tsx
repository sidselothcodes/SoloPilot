/**
 * Step 2 — Business type.
 * 2×3 grid of selectable cards, each with emoji icon + label.
 * Single-select; selected card gets accent border + accent-light background.
 */

"use client";

import type { BusinessType, BusinessTypeOption } from "@/lib/types";

const OPTIONS: BusinessTypeOption[] = [
  { value: "software", label: "Software / Tech", icon: "💻" },
  { value: "design", label: "Design / Creative", icon: "🎨" },
  { value: "consulting", label: "Consulting", icon: "📊" },
  { value: "photography", label: "Photography / Video", icon: "📸" },
  { value: "writing", label: "Writing / Content", icon: "✍️" },
  { value: "trades", label: "Trades / Services", icon: "🔧" },
];

interface StepTwoProps {
  value: BusinessType | null;
  onChange: (t: BusinessType) => void;
  onContinue: () => void;
}

export default function StepTwo({ value, onChange, onContinue }: StepTwoProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex flex-col items-start gap-3 rounded-2xl border bg-panel p-5 text-left transition-all ${
                selected
                  ? "border-accent bg-accentLight"
                  : "border-border hover:border-accentBorder"
              }`}
            >
              <span className="text-3xl">{opt.icon}</span>
              <span className="text-base font-semibold text-textPrimary">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!value}
        className="w-full rounded-xl bg-accent px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-accentHover disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue →
      </button>
    </div>
  );
}
