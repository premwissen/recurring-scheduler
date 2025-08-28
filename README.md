# Recurring Scheduler — Interview Assignment

Some pieces are intentionally incomplete with TODOs and inline instructions. Complete the TODOs and make tests pass.

Estimated time: 90–120 minutes.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the app:

```bash
npm start
# or
ng serve
```

Open `http://localhost:4200/` in your browser.

3. Run the unit tests:

```bash
npm test
# or
ng test
```

Tests print short hints while you build. As you complete TODOs, hints disappear and assertions pass.

## What You Need To Implement

Read the inline TODOs and the “Interview Task” banners in the UI pages. Do these:

- Service logic (in `src/app/services/schedule.service.ts`):
  - Implement `parseCronExpression` (5 fields → `Schedule | null`).
  - Implement `getHumanReadableDescription` (compose readable phrases).
  - Implement `normalizeSchedule` (split/trim/parse/dedupe/sort/clamp).

- Validator (in `src/app/validator/validator.component.*`):
  - Build a Reactive Form with a single control `cronExpression` (required + pattern to allow digits, spaces, commas, `*`).
  - Implement `updateStateFromExpression(expression: string)` to parse → validate → describe, and set component state accordingly.
  - Show/hide sections based on validity (use provided data-test hooks). Enable the Validate button only when the form is valid.

- Scheduler (in `src/app/scheduler/scheduler.component.*`):
  - Build a Reactive Form with controls: `minute`, `hour`, `dayOfMonth`, `month`, `dayOfWeek` (required + pattern/ranges).
  - In `validateAndPreview`, call `normalizeSchedule` then `validateSchedule`; when valid, display cron string and description.
  - Implement `resetForm()` to set all fields to `*` and clear outputs. Enable the Submit button only when the form is valid.


## Tips

- Keep component methods small. Heavy logic should go in helpers or services (see `updateStateFromExpression` in the Validator).
- Use the provided data-test attributes to verify visibility and behavior.
- Use the existing tests as a guide; they are written to help you converge on the expected behavior.

## Scripts

- Start dev server: `npm start`
- Run tests: `npm test`
- Build: `npm run build` or `ng build`
