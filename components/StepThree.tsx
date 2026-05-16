/**
 * Step 3 — Current business structure.
 * Three full-width stacked cards, each with a description.
 * Single-select; selected card gets accent border + light tint.
 */

"use client";

import type { BusinessStructure, BusinessStructureOption } from "@/lib/types";

const OPTIONS: BusinessStructureOption[] = [
  {
    value: "sole_prop",
    label: "Sole Proprietor",
    description:
      "Most freelancers start here. You pay 15.3% self-employment tax on all net income.",
  },
  {
    value: "llc",
    label: "Single-Member LLC",
    description:
      "Offers liability protection but is taxed the same as a sole proprietor by default.",
  },
  {
    value: "s_corp",
    label: "S-Corporation",
    description:
      "Pay yourself a salary and take the rest as distributions, reducing self-employment tax significantly.",
  },
];

interface StepThreeProps {
  value: BusinessStructure | null;
  onChange: (s: BusinessStructure) => void;
  onContinue: () => void;
}

export default function StepThree({ value, onChange, onContinue }: StepThreeProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex w-full flex-col gap-1.5 rounded-2xl border bg-panel p-5 text-left transition-all ${
                selected
                  ? "border-accent bg-accentLight"
                  : "border-border hover:border-accentBorder"
              }`}
            >
              <span className="text-base font-semibold text-textPrimary">
                {opt.label}
              </span>
              <span className="text-sm leading-relaxed text-textSecondary">
                {opt.description}
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
