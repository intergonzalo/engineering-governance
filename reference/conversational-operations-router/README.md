# Conversational Operations Router — Reference Implementation

An executable public reference for turning **natural conversational follow-ups into constrained operational actions** without letting the conversation layer become the authority boundary.

The project is synthetic and independent from the private production systems that inspired the pattern.

## What it demonstrates

- authenticated actor/workspace context;
- "this order" resolution from current UI/session context;
- ambiguity returned as indexed candidate sets instead of guessing;
- candidate selection that inherits the pending intent;
- natural confirmations such as `yes`, `ok`, `sim`, `sí` and `dale`;
- short-lived pending action state with TTL;
- destructive actions requiring confirmation;
- allowlisted domain-action execution;
- actor/workspace/correlation audit context;
- no arbitrary SQL/backend action surface.

## Run it

Requires Node.js 22+ and has no runtime dependencies.

```bash
npm run check
npm test
npm run demo
```

## Why this architecture

Natural language is deliberately permissive; operational authority should not be.

The router may understand shorthand, context and follow-up answers, but it outputs an explicit action envelope. A separate executor accepts only configured domain actions. This keeps conversational flexibility outside the business-enforcement boundary.

A response like "yes" has meaning only while a specific live pending action exists. An ambiguous command becomes a candidate-selection state rather than an unsafe guess.

## Public/private boundary

This reference contains no LLM provider integration, private prompt, production API route, real workshop/customer data, database schema or proprietary business rule.
