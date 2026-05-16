# SoloPilot

A self-employed tax savings estimator. Answer 4 questions about 
your income, business type, structure, and expenses — and get a 
personalized breakdown of what you're overpaying in self-employment 
tax and what you could save by restructuring.

Built inspired by Collective.


**Live demo:** https://solo-pilot-two.vercel.app


**Stack:** Next.js 14 · TypeScript · Tailwind CSS · OpenAI (gpt-4o-mini)

---

## How it works

The API route does the real tax math before calling OpenAI — net 
income, SE tax at 15.3%, reasonable S-Corp salary at 50% of net 
income, estimated savings. Those numbers get passed into the prompt 
so the AI is explaining pre-computed values, not guessing. It also 
handles edge cases: if your income is under $80K, it flags that 
S-Corp election costs more than it saves at that level.

The AI's job is the human-friendly explanation and a set of 
deduction opportunities specific to your business type.

The OpenAI key lives server-side only and never touches the client.

---

Built by Siddarth Seloth with help of Claude Code.
