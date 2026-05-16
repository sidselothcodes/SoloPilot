/**
 * SummaryBar — single horizontal pill row showing the user's key inputs
 * above the result card. Pure presentational summary of form state.
 */

"use client";

import { formatCurrency, sumExpenses } from "@/lib/formatters";
import { labelForBusinessStructure, labelForBusinessType } from "@/lib/prompts";
import type { EstimatorFormData } from "@/lib/types";

interface SummaryBarProps {
  data: EstimatorFormData;
}

export default function SummaryBar({ data }: SummaryBarProps) {
  const annualExpenses = sumExpenses(data.expenses) * 12;
  const parts: string[] = [
    `${formatCurrency(data.annualIncome)} income`,
    data.businessType ? labelForBusinessType(data.businessType) : "—",
    data.businessStructure ? labelForBusinessStructure(data.businessStructure) : "—",
    `${formatCurrency(annualExpenses)}/yr expenses`,
  ];

  return (
    <div className="rounded-full border border-border bg-panel px-4 py-2 text-center text-xs text-textSecondary">
      {parts.join(" · ")}
    </div>
  );
}
