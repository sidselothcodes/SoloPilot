/**
 * BackButton — reusable, low-emphasis back navigation between steps.
 * Sits below the form card. Renders nothing when on step 1.
 */

"use client";

import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export default function BackButton({ onClick, label = "Back" }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-sm text-textSecondary hover:underline focus:outline-none focus-visible:underline"
    >
      <ChevronLeft size={16} />
      <span>{label}</span>
    </button>
  );
}
