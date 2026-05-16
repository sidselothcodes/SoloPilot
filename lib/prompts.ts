/**
 * All LLM prompt templates for the SoloPilot Tax Savings Estimator.
 * Every prompt string in this app lives here — no inline prompts elsewhere.
 */

import type { BusinessStructure, BusinessType } from "./types";

export const SYSTEM_PROMPT = `You are a tax advisor specializing in self-employed individuals and solopreneurs. You give clear, specific, personalized tax analysis. Never give generic advice. Always reference the exact numbers provided. Do not include disclaimers about consulting a tax professional — this is a demo estimator.`;

// Human-readable labels used inside the prompt body.
const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  software: "Software / Tech",
  design: "Design / Creative",
  consulting: "Consulting",
  photography: "Photography / Video",
  writing: "Writing / Content",
  trades: "Trades / Services",
};

const BUSINESS_STRUCTURE_LABELS: Record<BusinessStructure, string> = {
  sole_prop: "Sole Proprietor",
  llc: "Single-Member LLC",
  s_corp: "S-Corporation",
};

export function labelForBusinessType(type: BusinessType): string {
  return BUSINESS_TYPE_LABELS[type];
}

export function labelForBusinessStructure(s: BusinessStructure): string {
  return BUSINESS_STRUCTURE_LABELS[s];
}

export interface PromptInputs {
  annualIncome: number;
  businessType: string;
  businessStructure: string;
  expenses: {
    homeOffice: number;
    software: number;
    equipment: number;
    travel: number;
    other: number;
  };
  annualExpenses: number;
  netIncome: number;
  currentSETax: number;
  reasonableSalary: number;
  sCorpSETax: number;
  estimatedSavings: number;
  alreadySCorp: boolean;
  sCorpNotRecommended: boolean;
}

// Builds the user-message prompt with all real numbers baked in.
export function generateEstimatePrompt(data: PromptInputs): string {
  const e = data.expenses;
  return `Analyze this person's tax situation:

Annual income: $${data.annualIncome.toLocaleString()}
Business type: ${data.businessType}
Current structure: ${data.businessStructure}
Annual expenses (totals = monthly × 12): $${data.annualExpenses.toLocaleString()}
  - Home Office: $${(e.homeOffice * 12).toLocaleString()}
  - Software & Subscriptions: $${(e.software * 12).toLocaleString()}
  - Equipment & Hardware: $${(e.equipment * 12).toLocaleString()}
  - Travel & Transportation: $${(e.travel * 12).toLocaleString()}
  - Other Business Expenses: $${(e.other * 12).toLocaleString()}
Net income (income - annual expenses): $${data.netIncome.toLocaleString()}
Current estimated SE tax: $${data.currentSETax.toLocaleString()}
Estimated reasonable S-Corp salary: $${data.reasonableSalary.toLocaleString()}
Estimated SE tax as S-Corp: $${data.sCorpSETax.toLocaleString()}
Estimated annual savings by switching to S-Corp: $${data.estimatedSavings.toLocaleString()}

Return JSON only, no markdown, no commentary. Use this exact shape:
{
  "currentTaxBurden": { "amount": number, "explanation": string },
  "potentialSavings": { "label": string, "amount": number, "explanation": string },
  "deductionOpportunities": [
    { "name": string, "estimatedAnnualValue": number, "explanation": string }
  ],
  "summary": string
}

Requirements:
- currentTaxBurden.amount should equal the Current estimated SE tax above.
- potentialSavings.amount should equal the Estimated annual savings above (use 0 if they are already an S-Corp).
- currentTaxBurden.explanation: one sentence, reference the 15.3% SE tax rate and the net income figure.
${
  data.alreadySCorp
    ? `- potentialSavings.label must be exactly: "What you're already saving".
- potentialSavings.explanation: one sentence that begins with "By already operating as an S-Corp..." and describes how their current structure is saving them SE tax versus operating as a sole proprietor.`
    : data.sCorpNotRecommended
    ? `- potentialSavings.label must be exactly: "S-Corp not recommended yet".
- potentialSavings.explanation must be exactly: "Your income of $${data.annualIncome.toLocaleString()} is below the threshold where S-Corp savings outweigh the additional accounting and filing costs (typically $2,000-$4,000/year). Focus on maximizing deductions instead."`
    : `- potentialSavings.label must be exactly: "What you could save".
- potentialSavings.explanation: one sentence that mentions the reasonable salary of $${data.reasonableSalary.toLocaleString()} and how distributions avoid SE tax.`
}
- deductionOpportunities: provide 3 to 4 items SPECIFIC to the "${data.businessType}" business type. A photographer's list should differ from a software consultant's. Each item needs a realistic estimatedAnnualValue in dollars and a one-sentence explanation tied to their work.
- For deductionOpportunities, each estimatedAnnualValue must be a realistic dollar amount based on the person's income and business type. Use these guidelines:
  - Minimum deduction value to include: $500
  - Client meals: typically $1,000 - $3,000/year for a consultant
  - Professional development: typically $1,500 - $4,000/year
  - Marketing: typically $1,200 - $3,600/year
  - Business insurance: typically $800 - $2,400/year
  - Home office: typically $2,000 - $6,000/year
  - Scale all amounts proportionally to the person's income level
  - Never return a deduction value under $500
  - Only include deductions where the estimated value is meaningful relative to the person's income
- summary: 2-3 sentences in plain English using the actual numbers above. End on the financial insight itself — no calls to action, no product mentions.${
    data.sCorpNotRecommended
      ? ` At this income level the S-Corp election does not pay off yet, so the summary must focus entirely on deduction opportunities as the primary savings lever — do not suggest switching to an S-Corp.`
      : ``
  }`;
}
