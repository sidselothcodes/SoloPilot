# Collective — Self-Employed Tax Savings Estimator

A 4-step demo flow that estimates how much a freelancer or solopreneur could save in self-employment tax by optimizing their business structure. Built to mirror the core idea behind [collective.com](https://collective.com).

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · OpenAI `gpt-4o-mini`

---

## 1. How to run locally

```bash
# 1. Install dependencies
npm install

# 2. Add your OpenAI key
cp .env.local.example .env.local
# then edit .env.local and set:
#   OPENAI_API_KEY=sk-...

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

That's it — fill in income, pick a business type, pick a structure, enter monthly expenses, hit **Calculate My Savings**.

---

## 2. Where to add the OpenAI key

Create a `.env.local` file in the project root:

```
OPENAI_API_KEY=your_key_here
```

- The key is only ever read on the server (`app/api/estimate/route.ts` via `process.env.OPENAI_API_KEY`).
- It is **never** shipped to the client and is not referenced anywhere under `app/page.tsx` or `components/`.
- `.env.local` is gitignored.

---

## 3. Full file tree

```
collective/
├── app/
│   ├── api/
│   │   └── estimate/
│   │       └── route.ts          POST endpoint: server-side tax math + OpenAI call
│   ├── globals.css               Tailwind layers + step fade transition classes
│   ├── layout.tsx                Open Sans, white background, metadata
│   └── page.tsx                  Composition only — pulls all state from useEstimator
│
├── components/
│   ├── BackButton.tsx            Reusable back nav
│   ├── LoadingState.tsx          Spinner + pulsing wordmark + rotating copy
│   ├── ResultCard.tsx            4-section AI output card + Collective CTA
│   ├── StepFour.tsx              Monthly expenses (live annual total)
│   ├── StepIndicator.tsx         4-dot progress bar with checkmarks
│   ├── StepOne.tsx               Annual income input + preset chips
│   ├── StepThree.tsx             Business structure (3 stacked cards)
│   ├── StepTwo.tsx               Business type (2×3 grid)
│   └── SummaryBar.tsx            Pill row summarizing user's inputs
│
├── hooks/
│   └── useEstimator.ts           All step/form/transition/loading/result state
│
├── lib/
│   ├── formatters.ts             Currency, percent, parse helpers
│   ├── prompts.ts                System prompt + generateEstimatePrompt()
│   └── types.ts                  All TypeScript interfaces (no `any` in the app)
│
├── .env.local.example            Template for the OpenAI key
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts            Pastel red palette + Open Sans variable
└── tsconfig.json
```

---

## How the AI gets real numbers

Before the OpenAI call, `app/api/estimate/route.ts` computes:

```
annualExpenses    = sum(monthly expenses) × 12
netIncome         = annualIncome − annualExpenses
currentSETax      = netIncome × 0.9235 × 0.153
reasonableSalary  = netIncome × 0.5            // simplified S-Corp estimate
sCorpSETax        = reasonableSalary × 0.9235 × 0.153
estimatedSavings  = currentSETax − sCorpSETax
```

These values are baked into the prompt in `lib/prompts.ts` so the model is reasoning over real numbers and only has to produce the human-friendly explanations and a business-type-specific deduction list. The model is forced into JSON output via `response_format: { type: "json_object" }`.

---

## Notes

- All prompt strings live in `lib/prompts.ts`. No prompts inline anywhere else.
- All state lives in `hooks/useEstimator.ts`. `app/page.tsx` is composition only.
- No `any` types — every shape is in `lib/types.ts`.
- Step transitions use a 200ms CSS opacity + translate, driven by an `isTransitioning` flag from the hook. No animation library.
