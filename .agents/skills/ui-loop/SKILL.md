---
name: ui-loop
description: Run the generator and evaluator UI loop on a screen or checkpoint in the i-amrita site. Use when a change renders pixels (routes, components, styles, tokens) and needs visual verification at 375, 768, and 1280 widths in light and dark themes.
---

# UI loop

Full policy: `.agents/docs/ui-loop.md`. This skill is the runnable procedure.

## Before you start

Confirm all of these. If one is missing, stop and report the gap.

1. A screen spec exists in `.agents/screens/`.
2. The reference docs that the spec cites exist.
3. A rubric exists for the checkpoint.
4. A baseline screenshot exists, if one is expected.
5. The app is reachable. Run `pnpm dev` (http://localhost:4321) or `pnpm preview` (http://localhost:4322).

## Procedure

1. Generate. Make the change for one screen or checkpoint only.
2. Capture. Use the `playwright-cli` skill. Take screenshots at 375x812, 768x1024, and 1280 wide, each in `?theme=light` and `?theme=dark`. Save the console log and the axe report. Keep output terse.
3. Check the hard gates. Console errors 0, console warnings 0, 5xx responses 0, axe critical and serious 0, no layout collapse, e2e green. Any failure is a FAIL. Skip the rubric.
4. Evaluate in isolation. Start a fresh subagent on a different model family from the generator. Give it only the screenshots, the screen spec, the reference docs, the rubric, the console log, the axe report, and the e2e result. Do not give it the diff, your rationale, or the previous verdict.
5. Record the verdict in the schema below. Do not add a numeric score or prose outside it.
6. Fix the highest-severity finding first, then return to step 1.
7. Stop after 3 iterations. Write the ledger and report the open findings to the human.

## Verdict schema

```
verdict: PASS | FAIL
findings:
  - severity: P0 | P1 | P2
    area: <string>
    expected: <spec line or reference doc>
    observed: <evidence path, for example a screenshot or log line>
    fix: <string>
```

## Ledger

For each iteration, record the findings closed and the findings opened. If a finding reappears after being marked fixed, end the run and escalate. Do not retry past that point.

## Write-back

When a pass is approved, update the screen spec and the baseline screenshot in the same commit as the code.

## Do not

- Evaluate your own work in the same context.
- Judge a screen without a screenshot.
- Write "looks good" as a verdict.
- Optimize against the rubric as a checklist.
