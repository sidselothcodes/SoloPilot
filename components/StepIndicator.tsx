/**
 * StepIndicator — top progress bar.
 * 4 dots connected by a line. Active dot is solid red, completed dots
 * show a checkmark, inactive dots are light-bordered circles.
 */

"use client";

import { Check } from "lucide-react";
import type { StepNumber } from "@/lib/types";

const STEP_LABELS = ["Income", "Business", "Structure", "Expenses"] as const;

interface StepIndicatorProps {
  current: StepNumber;
}

export default function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="relative flex items-center justify-between">
        {/* Connector line behind dots */}
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border" aria-hidden />

        {STEP_LABELS.map((label, idx) => {
          const stepNum = (idx + 1) as StepNumber;
          const isCompleted = stepNum < current;
          const isActive = stepNum === current;
          return <Dot key={label} active={isActive} completed={isCompleted} />;
        })}
      </div>

      <div className="mt-2 flex items-start justify-between">
        {STEP_LABELS.map((label, idx) => {
          const stepNum = (idx + 1) as StepNumber;
          const isActive = stepNum === current;
          return (
            <div
              key={label}
              className={`w-16 text-center text-xs ${
                isActive ? "text-accent font-semibold" : "text-textSecondary"
              }`}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Renders one dot in the step indicator with the appropriate state styling.
function Dot({ active, completed }: { active: boolean; completed: boolean }) {
  const base =
    "relative z-10 flex h-6 w-6 items-center justify-center rounded-full border transition-colors";
  if (completed) {
    return (
      <div className={`${base} border-accent bg-accent text-white`}>
        <Check size={14} strokeWidth={3} />
      </div>
    );
  }
  if (active) {
    return <div className={`${base} border-accent bg-accent`} />;
  }
  return <div className={`${base} border-accentBorder bg-white`} />;
}
