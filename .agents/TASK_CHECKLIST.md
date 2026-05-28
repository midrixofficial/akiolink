# Task Checklist For AI Agents

Use this checklist before opening a PR or finishing a task.

## 1) Understand Scope
- Identify whether task is:
  - UI-only
  - API-only
  - UI + API integration
- Locate impacted files before editing.

## 2) Preserve Flow
- If changing merchant pages, ensure `App.jsx` route-to-page mapping still works.
- If changing sidebar labels or pages, keep `menuByPath` and displayed menu states aligned.
- If changing auth behavior, keep localStorage token/user flow consistent.

## 3) Theme Safety
- Verify light and dark mode visuals for changed components.
- Keep dark toggle functional (do not remove `document.documentElement` `dark` class sync).

## 4) API Safety
- Match frontend calls to existing endpoints in `routes/api.php`.
- For protected endpoints, ensure Sanctum token flow assumptions stay intact.

## 5) Quality Gate
- Remove unused imports/props after edits.
- Run build:
  - `npm run build`
- If backend changed, run relevant tests or at least syntax checks.

## 6) Output Discipline
- Summarize exactly what changed.
- Mention any assumptions made.
- Mention anything not verified (if any).
