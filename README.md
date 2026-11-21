# LLM Security Project

A React and Vite FYP prototype for managing prompt policies, model integration records, enforcement events, and compliance checks.

## Run locally

Use Node.js 22 or newer:

```sh
npm ci
npm run dev
```

Run `npm test` for the prompt guard and compliance tests. Run `npm run build` to build the frontend.

## Prompt checks

Active policies restrict literal, comma-separated keywords. Matching ignores case, normalizes Unicode compatibility characters, and checks word boundaries to avoid matching `card` inside `cardboard`. A small set of instruction-bypass phrases is also blocked. This rule-based prototype cannot detect every semantic, obfuscated, or multilingual attack.

Groups and per-day limits are recorded for reference. Prompt checks apply all active keyword policies regardless of the email or group entered.

## Compliance checks

Safety Baseline and Jailbreak Resistance evaluate fixed prompt cases against the configured rules. Scores represent the percentage of cases whose decisions match their expected results. The UI shows each expected and actual decision so failures can be reviewed. The model field records a label only; these checks do not call or certify an LLM provider.

Scores of 85% or higher pass. Scores from 70% through 84% require review, and scores below 70% fail. The initial history includes legacy demo rows that are excluded from dashboard pass totals.

Application data is stored in browser localStorage. Authentication and provider status are demo features; there is no server-side enforcement or live provider connection. Use synthetic data when evaluating the prototype.

## Preview and hosting

After building, run `npm run preview` to check the production bundle locally. A static host serving the build should route application paths such as `/compliance` to `index.html` so direct visits and refreshes work.
