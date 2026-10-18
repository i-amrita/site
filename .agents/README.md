# Agent docs index

This folder holds the working knowledge for agents in this repo. `AGENTS.md` at the repo root is the entry point. It lists the hard rules and points here for detail. Read this index first, then open only the doc that matches your task.

## Docs

| Doc | Read it when |
|---|---|
| `docs/architecture.md` | You need the layout, the data flow, or the status of each module. |
| `docs/url-state.md` | You touch any URL parameter, action key, overlay, or palette state, or you need QA flows. |
| `docs/tokens.md` | You change colors, radii, shadows, or fonts, or you need a semantic class name. |
| `docs/component-conventions.md` | You add or move a component, or you touch anything under `src/components/ui/`. |
| `docs/search.md` | You work on search, the Pagefind index, or the semantic layer. Status: design. |
| `docs/cmdK.md` | You work on the command palette. Status: design. |
| `docs/ui-loop.md` | You change anything that renders pixels, then run the loop. |

## Skills

| Skill | Use it for |
|---|---|
| `skills/ui-loop/SKILL.md` | The runnable generator and evaluator loop for UI changes. |

## Screens

`screens/` holds ASCII layouts and key maps for each planned screen. Each screen spec is the input to the UI loop. Specs describe intent, and the code is the contract when the two disagree. `url-state.md` lists the known gaps.

## Not yet written

These docs are planned by the build plan and are owned by other work. Do not create them from this index. `build.md`, `audio.md`, `llms.md`, and `i18n.md` belong to their own changes.

## Conventions

- One paragraph per line in Markdown. Do not hard-wrap.
- No em dashes.
- Commands use pnpm. Use `pnpm dlx` for one-off binaries.
- Plans for non-trivial work go in `.agents/plans/YYYY-MM-DD-<slug>.md`. That folder is gitignored.
