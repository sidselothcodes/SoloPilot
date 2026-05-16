/**
 * POST /api/estimate
 *
 * Computes server-side tax math (SE tax, S-Corp savings) from the form
 * data, hands those numbers to gpt-4o-mini, and returns the structured
 * JSON breakdown rendered by ResultCard.
 *
 * OPENAI_API_KEY is read from process.env only — never exposed to the
 * client. Errors are returned as typed { error: string } responses.
 */

import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  SYSTEM_PROMPT,
  generateEstimatePrompt,
  labelForBusinessStructure,
  labelForBusinessType,
} from "@/lib/prompts";
import type {
  BusinessStructure,
  BusinessType,
  EstimateApiError,
  EstimateRequest,
  EstimateResult,
  ExpenseBreakdown,
} from "@/lib/types";

export const runtime = "nodejs";

// Validates the POST body and coerces it into the EstimateRequest shape.
function parseBody(raw: unknown): EstimateRequest | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const income = Number(r.annualIncome);
  const expensesIn = r.expenses as Record<string, unknown> | undefined;
  if (!Number.isFinite(income) || income < 0) return null;
  if (typeof r.businessType !== "string" || typeof r.businessStructure !== "string") {
    return null;
  }
  if (!expensesIn || typeof expensesIn !== "object") return null;

  const expenses: ExpenseBreakdown = {
    homeOffice: toNonNegative(expensesIn.homeOffice),
    software: toNonNegative(expensesIn.software),
    equipment: toNonNegative(expensesIn.equipment),
    travel: toNonNegative(expensesIn.travel),
    other: toNonNegative(expensesIn.other),
  };

  return {
    annualIncome: income,
    businessType: r.businessType,
    businessStructure: r.businessStructure,
    expenses,
  };
}

function toNonNegative(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// Resolves a business type/structure code to its human label for the prompt.
function readableBusinessType(code: string): string {
  const known: BusinessType[] = [
    "software",
    "design",
    "consulting",
    "photography",
    "writing",
    "trades",
  ];
  return known.includes(code as BusinessType)
    ? labelForBusinessType(code as BusinessType)
    : code;
}

function readableBusinessStructure(code: string): string {
  const known: BusinessStructure[] = ["sole_prop", "llc", "s_corp"];
  return known.includes(code as BusinessStructure)
    ? labelForBusinessStructure(code as BusinessStructure)
    : code;
}

// Strips ```json fences if the model returns them despite instructions.
function stripCodeFences(s: string): string {
  return s
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const err: EstimateApiError = { error: "OPENAI_API_KEY is not configured." };
      return NextResponse.json(err, { status: 500 });
    }

    const body = parseBody(await req.json());
    if (!body) {
      const err: EstimateApiError = { error: "Invalid request body." };
      return NextResponse.json(err, { status: 400 });
    }

    // Server-side tax math — see brief.
    const monthlyExpenses =
      body.expenses.homeOffice +
      body.expenses.software +
      body.expenses.equipment +
      body.expenses.travel +
      body.expenses.other;
    const annualExpenses = monthlyExpenses * 12;
    const netIncome = Math.max(0, body.annualIncome - annualExpenses);
    const currentSETax = netIncome * 0.9235 * 0.153;
    const reasonableSalary = netIncome * 0.5;
    const sCorpSETax = reasonableSalary * 0.9235 * 0.153;
    const estimatedSavings = Math.max(0, currentSETax - sCorpSETax);

    const userPrompt = generateEstimatePrompt({
      annualIncome: body.annualIncome,
      businessType: readableBusinessType(body.businessType),
      businessStructure: readableBusinessStructure(body.businessStructure),
      expenses: body.expenses,
      annualExpenses,
      netIncome,
      currentSETax: Math.round(currentSETax),
      reasonableSalary: Math.round(reasonableSalary),
      sCorpSETax: Math.round(sCorpSETax),
      estimatedSavings: Math.round(estimatedSavings),
      alreadySCorp: body.businessStructure === "s_corp",
      sCorpNotRecommended: body.annualIncome < 80000,
    });

    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    if (!raw) {
      const err: EstimateApiError = { error: "Empty response from model." };
      return NextResponse.json(err, { status: 502 });
    }

    let parsed: EstimateResult;
    try {
      parsed = JSON.parse(stripCodeFences(raw)) as EstimateResult;
    } catch {
      const err: EstimateApiError = { error: "Model returned invalid JSON." };
      return NextResponse.json(err, { status: 502 });
    }

    return NextResponse.json(parsed satisfies EstimateResult);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown server error.";
    const err: EstimateApiError = { error: message };
    return NextResponse.json(err, { status: 500 });
  }
}
