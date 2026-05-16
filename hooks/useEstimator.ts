/**
 * useEstimator — single source of truth for the estimator flow.
 *
 * Owns: current step, form data, transition state, loading state,
 * AI result, and the submit handler that calls /api/estimate.
 * page.tsx and components stay presentational; all state lives here.
 */

"use client";

import { useCallback, useState } from "react";
import type {
  BusinessStructure,
  BusinessType,
  EstimateResult,
  EstimatorFormData,
  ExpenseBreakdown,
  StepNumber,
} from "@/lib/types";

const INITIAL_EXPENSES: ExpenseBreakdown = {
  homeOffice: 0,
  software: 0,
  equipment: 0,
  travel: 0,
  other: 0,
};

const INITIAL_FORM: EstimatorFormData = {
  annualIncome: 0,
  businessType: null,
  businessStructure: null,
  expenses: INITIAL_EXPENSES,
};

// 200ms must match the CSS transition duration in globals.css / step containers.
const TRANSITION_MS = 200;

export interface UseEstimatorReturn {
  step: StepNumber;
  formData: EstimatorFormData;
  isTransitioning: boolean;
  isLoading: boolean;
  result: EstimateResult | null;
  error: string | null;
  setAnnualIncome: (n: number) => void;
  setBusinessType: (t: BusinessType) => void;
  setBusinessStructure: (s: BusinessStructure) => void;
  setExpense: (key: keyof ExpenseBreakdown, value: number) => void;
  setExpenses: (expenses: ExpenseBreakdown) => void;
  goNext: () => void;
  goBack: () => void;
  submit: () => Promise<void>;
  reset: () => void;
}

export function useEstimator(): UseEstimatorReturn {
  const [step, setStep] = useState<StepNumber>(1);
  const [formData, setFormData] = useState<EstimatorFormData>(INITIAL_FORM);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Drives the fade/translate transition: fade out, change step, fade in.
  const transitionTo = useCallback((next: StepNumber) => {
    setIsTransitioning(true);
    window.setTimeout(() => {
      setStep(next);
      setIsTransitioning(false);
    }, TRANSITION_MS);
  }, []);

  const setAnnualIncome = useCallback((n: number) => {
    setFormData((prev) => ({ ...prev, annualIncome: n }));
  }, []);

  const setBusinessType = useCallback((t: BusinessType) => {
    setFormData((prev) => ({ ...prev, businessType: t }));
  }, []);

  const setBusinessStructure = useCallback((s: BusinessStructure) => {
    setFormData((prev) => ({ ...prev, businessStructure: s }));
  }, []);

  // Updates a single expense field while leaving the rest untouched.
  const setExpense = useCallback(
    (key: keyof ExpenseBreakdown, value: number) => {
      setFormData((prev) => ({
        ...prev,
        expenses: { ...prev.expenses, [key]: value },
      }));
    },
    [],
  );

  // Replaces the full expense breakdown in one update (used by "Fill with demo data").
  const setExpenses = useCallback((expenses: ExpenseBreakdown) => {
    setFormData((prev) => ({ ...prev, expenses }));
  }, []);

  const goNext = useCallback(() => {
    if (step < 4) transitionTo((step + 1) as StepNumber);
  }, [step, transitionTo]);

  const goBack = useCallback(() => {
    if (step > 1) transitionTo((step - 1) as StepNumber);
  }, [step, transitionTo]);

  // POSTs the form to /api/estimate and stores the AI response.
  const submit = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          annualIncome: formData.annualIncome,
          businessType: formData.businessType,
          businessStructure: formData.businessStructure,
          expenses: formData.expenses,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "Something went wrong.");
        setIsLoading(false);
        return;
      }
      setResult(data as EstimateResult);
      setIsLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
      setIsLoading(false);
    }
  }, [formData]);

  const reset = useCallback(() => {
    setStep(1);
    setFormData(INITIAL_FORM);
    setResult(null);
    setError(null);
    setIsLoading(false);
    setIsTransitioning(false);
  }, []);

  return {
    step,
    formData,
    isTransitioning,
    isLoading,
    result,
    error,
    setAnnualIncome,
    setBusinessType,
    setBusinessStructure,
    setExpense,
    setExpenses,
    goNext,
    goBack,
    submit,
    reset,
  };
}
