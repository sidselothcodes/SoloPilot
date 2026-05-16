/**
 * Step 1 — Annual income.
 * Large $-prefixed number input plus quick-select preset chips.
 * "Continue" disabled until income > 0.
 */

"use client";

import { formatCurrency } from "@/lib/formatters";

const PRESETS = [30000, 60000, 90000, 120000, 150000] as const;

interface StepOneProps {
  value: number;
  onChange: (n: number) => void;
  onContinue: () => void;
}

export default function StepOne({ value, onChange, onContinue }: StepOneProps) {
  // Allows typing while keeping state strictly numeric.
  const handleInput = (raw: string) => {
    const cleaned = raw.replace(/[^0-9]/g, "");
    onChange(cleaned ? parseInt(cleaned, 10) : 0);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-3xl text-textSecondary">
          $
        </span>
        <input
          inputMode="numeric"
          autoFocus
          value={value === 0 ? "" : value.toLocaleString("en-US")}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="0"
          className="w-full rounded-2xl border border-border bg-panel py-5 pl-12 pr-5 text-3xl font-semibold text-textPrimary outline-none transition-colors focus:border-accent focus:bg-white"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p, idx) => {
          const isLast = idx === PRESETS.length - 1;
          const selected = value === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                selected
                  ? "border-accent bg-accentLight text-accent"
                  : "border-border bg-white text-textPrimary hover:border-accentBorder"
              }`}
            >
              {formatCurrency(p)}
              {isLast ? "+" : ""}
            </button>
          );
        })}
      </div>

      <ContinueButton onClick={onContinue} disabled={value <= 0} />
    </div>
  );
}

// Primary CTA — kept in this file because it's only used here.
function ContinueButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-2 w-full rounded-xl bg-accent px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-accentHover disabled:cursor-not-allowed disabled:opacity-50"
    >
      Continue →
    </button>
  );
}
