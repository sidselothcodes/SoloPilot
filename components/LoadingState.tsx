/**
 * LoadingState — full-card replacement while AI processes.
 * Pulses the SoloPilot wordmark and cycles through three lines of copy
 * every 1.5s. Pure CSS animation, no external animation library.
 */

"use client";

import { useEffect, useState } from "react";

const LINES = [
  "Analyzing your income structure...",
  "Calculating self-employment tax...",
  "Identifying your savings opportunities...",
] as const;

export default function LoadingState() {
  const [idx, setIdx] = useState(0);

  // Rotates the loading copy every 1.5 seconds.
  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % LINES.length);
    }, 1500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <div className="flex flex-col items-center gap-1">
        <div className="animate-softPulse text-sm font-semibold tracking-widest text-accent">
          SOLOPILOT
        </div>
        <div className="text-xs text-textSecondary">
          Tax clarity for the self-employed.
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Spinner />
      </div>

      <p className="min-h-[1.5rem] text-center text-sm text-textSecondary transition-opacity">
        {LINES[idx]}
      </p>
    </div>
  );
}

// Minimal CSS-only spinner using a rotating ring.
function Spinner() {
  return (
    <div
      className="h-6 w-6 animate-spin rounded-full border-2 border-accentBorder border-t-accent"
      aria-label="Loading"
    />
  );
}
