/**
 * ResultCard — the AI output card.
 * Four sections: current burden, potential savings, deduction
 * opportunities, and a plain-English summary.
 */

"use client";

import { formatCurrency } from "@/lib/formatters";
import type { EstimateResult } from "@/lib/types";

interface ResultCardProps {
  result: EstimateResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const sCorpNotRecommended =
    result.potentialSavings.label === "S-Corp not recommended yet";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-8 rounded-2xl border border-border bg-panel p-8 shadow-card">
        <Section
          label="What you're paying now"
          amount={formatCurrency(result.currentTaxBurden.amount)}
          subtext={result.currentTaxBurden.explanation}
        />

        <Section
          label={result.potentialSavings.label}
          amount={
            sCorpNotRecommended
              ? undefined
              : formatCurrency(result.potentialSavings.amount)
          }
          subtext={result.potentialSavings.explanation}
          amountAccent={!sCorpNotRecommended}
        />

        <DeductionsSection items={result.deductionOpportunities} />

        <BottomLineSection summary={result.summary} />
      </div>
    </div>
  );
}

// Reusable two-line section: small label, large amount, supporting sentence.
function Section({
  label,
  amount,
  subtext,
  amountAccent,
}: {
  label: string;
  amount?: string;
  subtext: string;
  amountAccent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-textSecondary">
        {label}
      </div>
      {amount !== undefined && (
        <div
          className={`text-4xl font-bold ${
            amountAccent ? "text-accent" : "text-textPrimary"
          }`}
        >
          {amount}
        </div>
      )}
      <p className="text-sm leading-relaxed text-textSecondary">{subtext}</p>
    </div>
  );
}

// Lists deduction opportunities with annual value and short explanation.
function DeductionsSection({ items }: { items: EstimateResult["deductionOpportunities"] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-textSecondary">
        Deductions you may be missing
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((d) => (
          <li
            key={d.name}
            className="flex items-start justify-between gap-4 rounded-xl border border-border bg-white px-4 py-3"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-textPrimary">{d.name}</span>
              <span className="text-xs leading-relaxed text-textSecondary">
                {d.explanation}
              </span>
            </div>
            <span className="shrink-0 text-sm font-semibold text-accent">
              {formatCurrency(d.estimatedAnnualValue)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The closing 2-3 sentence summary block.
function BottomLineSection({ summary }: { summary: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-textSecondary">
        Bottom line
      </div>
      <p className="text-sm leading-relaxed text-textPrimary">{summary}</p>
    </div>
  );
}
