/**
 * Step 4 — Monthly business expenses.
 * Five $-prefixed inputs and a live annual-deduction total.
 * "Calculate My Savings →" triggers the submit handler from useEstimator.
 */

"use client";

import { formatCurrency, sumExpenses } from "@/lib/formatters";
import type { ExpenseBreakdown } from "@/lib/types";

const FIELDS: { key: keyof ExpenseBreakdown; label: string }[] = [
  { key: "homeOffice", label: "Home Office" },
  { key: "software", label: "Software & Subscriptions" },
  { key: "equipment", label: "Equipment & Hardware" },
  { key: "travel", label: "Travel & Transportation" },
  { key: "other", label: "Other Business Expenses" },
];

const DEMO_EXPENSES: ExpenseBreakdown = {
  homeOffice: 500,
  software: 300,
  equipment: 150,
  travel: 200,
  other: 100,
};

interface StepFourProps {
  expenses: ExpenseBreakdown;
  onChange: (key: keyof ExpenseBreakdown, value: number) => void;
  onFillDemo: (expenses: ExpenseBreakdown) => void;
  onSubmit: () => void;
}

export default function StepFour({
  expenses,
  onChange,
  onFillDemo,
  onSubmit,
}: StepFourProps) {
  const annualTotal = sumExpenses(expenses) * 12;

  // Strips non-digits, parses safely, and forwards to the parent setter.
  const handleInput = (key: keyof ExpenseBreakdown, raw: string) => {
    const cleaned = raw.replace(/[^0-9]/g, "");
    onChange(key, cleaned ? parseInt(cleaned, 10) : 0);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-start">
        <button
          type="button"
          onClick={() => onFillDemo(DEMO_EXPENSES)}
          className="rounded-lg bg-[#e85d5d] px-4 py-2 text-sm text-white transition-colors hover:bg-[#d44f4f]"
        >
          Fill with demo data
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {FIELDS.map((f) => (
          <ExpenseRow
            key={f.key}
            label={f.label}
            value={expenses[f.key]}
            onInput={(raw) => handleInput(f.key, raw)}
          />
        ))}
      </div>

      <div className="rounded-xl border border-border bg-panel px-4 py-3 text-sm">
        <span className="text-textSecondary">Estimated annual deductions: </span>
        <span className="font-semibold text-textPrimary">
          {formatCurrency(annualTotal)}
        </span>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="w-full rounded-xl bg-accent px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-accentHover"
      >
        Calculate My Savings →
      </button>
    </div>
  );
}

// One labeled expense input. Kept local — only used in this step.
function ExpenseRow({
  label,
  value,
  onInput,
}: {
  label: string;
  value: number;
  onInput: (raw: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white px-4 py-3 focus-within:border-accent">
      <span className="text-sm text-textPrimary">{label}</span>
      <span className="flex items-center gap-1">
        <span className="text-textSecondary">$</span>
        <input
          inputMode="numeric"
          value={value === 0 ? "" : value.toLocaleString("en-US")}
          onChange={(e) => onInput(e.target.value)}
          placeholder="0"
          className="w-28 bg-transparent text-right text-base font-medium text-textPrimary outline-none"
        />
      </span>
    </label>
  );
}
