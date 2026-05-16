/**
 * Shared TypeScript interfaces for the SoloPilot Tax Savings Estimator.
 * Every shape that crosses a boundary — form state, API request/response,
 * AI output — is defined here so no file needs to use `any`.
 */

export type BusinessType =
  | "software"
  | "design"
  | "consulting"
  | "photography"
  | "writing"
  | "trades";

export type BusinessStructure = "sole_prop" | "llc" | "s_corp";

export interface ExpenseBreakdown {
  homeOffice: number;
  software: number;
  equipment: number;
  travel: number;
  other: number;
}

export interface EstimatorFormData {
  annualIncome: number;
  businessType: BusinessType | null;
  businessStructure: BusinessStructure | null;
  expenses: ExpenseBreakdown;
}

export interface EstimateRequest {
  annualIncome: number;
  businessType: string;
  businessStructure: string;
  expenses: ExpenseBreakdown;
}

export interface DeductionOpportunity {
  name: string;
  estimatedAnnualValue: number;
  explanation: string;
}

export interface EstimateResult {
  currentTaxBurden: {
    amount: number;
    explanation: string;
  };
  potentialSavings: {
    label: string;
    amount: number;
    explanation: string;
  };
  deductionOpportunities: DeductionOpportunity[];
  summary: string;
}

export interface EstimateApiError {
  error: string;
}

export type EstimateApiResponse = EstimateResult | EstimateApiError;

export interface BusinessTypeOption {
  value: BusinessType;
  label: string;
  icon: string;
}

export interface BusinessStructureOption {
  value: BusinessStructure;
  label: string;
  description: string;
}

export type StepNumber = 1 | 2 | 3 | 4;
