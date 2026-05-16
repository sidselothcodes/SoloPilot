/**
 * Main page — composition only.
 * Pulls all state from useEstimator and renders:
 *   - wordmark + step indicator + step heading
 *   - the active step component (with fade transition), or
 *   - the loading state, or
 *   - the result view (SummaryBar + ResultCard).
 */

"use client";

import BackButton from "@/components/BackButton";
import LoadingState from "@/components/LoadingState";
import ResultCard from "@/components/ResultCard";
import StepFour from "@/components/StepFour";
import StepIndicator from "@/components/StepIndicator";
import StepOne from "@/components/StepOne";
import StepThree from "@/components/StepThree";
import StepTwo from "@/components/StepTwo";
import SummaryBar from "@/components/SummaryBar";
import { useEstimator } from "@/hooks/useEstimator";

const STEP_HEADINGS: Record<number, { title: string; subtext: string }> = {
  1: {
    title: "What's your annual freelance income?",
    subtext: "Include all self-employment income before expenses.",
  },
  2: {
    title: "What type of work do you do?",
    subtext: "This helps us identify deductions specific to your industry.",
  },
  3: {
    title: "How is your business currently structured?",
    subtext: "Your structure determines how much self-employment tax you pay.",
  },
  4: {
    title: "What are your typical monthly business expenses?",
    subtext: "We'll calculate your annual deductions from these.",
  },
};

export default function Page() {
  const est = useEstimator();
  const heading = STEP_HEADINGS[est.step];

  // While the AI is thinking, swap the form for the loading state.
  if (est.isLoading) {
    return (
      <PageShell>
        <LoadingState />
      </PageShell>
    );
  }

  // After the AI returns, render the result view.
  if (est.result) {
    return (
      <PageShell>
        <Wordmark />
        <h1 className="text-center text-3xl font-bold text-textPrimary">Your tax savings estimate</h1>
        <SummaryBar data={est.formData} />
        <ResultCard result={est.result} />
        <div className="flex justify-center">
          <button
            type="button"
            onClick={est.reset}
            className="text-sm text-textSecondary hover:underline"
          >
            Start over
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Wordmark />

      {est.step === 1 && <Hero />}

      <StepIndicator current={est.step} />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-textPrimary">{heading.title}</h1>
        <p className="text-sm text-textSecondary">{heading.subtext}</p>
      </div>

      {est.error && (
        <div className="rounded-xl border border-accentBorder bg-accentLight px-4 py-3 text-sm text-accent">
          {est.error}
        </div>
      )}

      <div
        className={`step-transition ${
          est.isTransitioning ? "step-hidden" : "step-visible"
        }`}
      >
        {est.step === 1 && (
          <StepOne
            value={est.formData.annualIncome}
            onChange={est.setAnnualIncome}
            onContinue={est.goNext}
          />
        )}
        {est.step === 2 && (
          <StepTwo
            value={est.formData.businessType}
            onChange={est.setBusinessType}
            onContinue={est.goNext}
          />
        )}
        {est.step === 3 && (
          <StepThree
            value={est.formData.businessStructure}
            onChange={est.setBusinessStructure}
            onContinue={est.goNext}
          />
        )}
        {est.step === 4 && (
          <StepFour
            expenses={est.formData.expenses}
            onChange={est.setExpense}
            onFillDemo={est.setExpenses}
            onSubmit={est.submit}
          />
        )}
      </div>

      {est.step > 1 && (
        <div className="flex">
          <BackButton onClick={est.goBack} />
        </div>
      )}
    </PageShell>
  );
}

// Outer page wrapper — 640px centered column with generous vertical padding.
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[640px] flex-col gap-6 px-6 py-16">
      {children}
    </main>
  );
}

// Small SoloPilot wordmark + tagline used as the in-flow header.
function Wordmark() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-bold tracking-widest text-[#e85d5d]">
        SOLOPILOT
      </div>
      <div className="text-sm text-[#6b7280] mt-1">
        Tax clarity for the self-employed.
      </div>
    </div>
  );
}

// Hero — shown only above the Step 1 card.
function Hero() {
  return (
    <div className="flex flex-col gap-3 pt-2">
      <h1 className="text-2xl font-bold text-[#1a1a1a] text-center">
        Find out what you&apos;re leaving on the table.
      </h1>
      <p className="text-sm text-[#6b7280] text-center max-w-lg mx-auto mt-3">
        SoloPilot estimates how much you&apos;re overpaying in self-employment
        taxes based on your income, business type, and expenses. Answer 4 quick
        questions and get a personalized breakdown in seconds.
      </p>
    </div>
  );
}
