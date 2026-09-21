# Assessment: Signal Forms (Angular 22)

One-session, hands-on. Build a real component in this project, no starter code, no answer key — each task tells you what "done" looks like via observable behavior, not solution code.

**Prerequisite:** `@angular/forms/signals` is available (`@angular/core` / `@angular/forms` are `^22.0.0` in this project's `package.json`).

## Target

Build a standalone component `SignupForm` at `src/app/signup-form/signup-form.ts` (+ template, selector `app-signup-form`). Render it from `App`'s template so you can exercise it live at `ng serve`.

**Fields:**
- `fullName` — string, required
- `email` — string, required, must be a valid email
- `newsletterOptIn` — boolean (checkbox)
- `referralCode` — string, required **only when** `newsletterOptIn` is checked

---

## Task 1 — Model + schema

Create the data model as a plain `signal({...})` and wrap it with `form()`, passing a schema function that applies `required` to `fullName` and `required` + `email` to `email`. Don't wire up the template yet.

**Acceptance criteria:**
- The form compiles and the schema runs — you can inspect `userForm.fullName().invalid()` (e.g. via a temporary `console.log` or template expression) and see `true` when the model's `fullName` is empty.
- `userForm.email().invalid()` is `true` for `"not-an-email"` and `false` for `"a@b.com"`.

## Task 2 — Bind fields, show errors only when touched

Bind `fullName` and `email` to `<input>` elements using the `FormField` directive. Add error text under each field, but it must only appear when the field is **both** touched and invalid — not on first render.

**Acceptance criteria:**
- On page load, no error text is visible even though both fields are empty (and therefore invalid).
- Clicking into the `email` field, typing garbage, then clicking away (blurring) shows an error message.
- Clearing the garbage and typing a valid email removes the error message.

## Task 3 — Conditional requirement

Add `newsletterOptIn` as a checkbox and `referralCode` as a text field. In the schema, make `referralCode` required **only when** `newsletterOptIn` is checked, using the `when`-option form of the validator (not the deprecated raw-function form).

**Acceptance criteria:**
- With the checkbox unchecked, `referralCode` is valid even when empty.
- Checking the checkbox with `referralCode` empty makes it invalid; a required-error appears once the field is touched.
- Unchecking the checkbox again clears that error immediately, even without re-touching the field.

## Task 4 — Gate submit on validity

Add a submit `<button>`. It must be disabled whenever the overall form is invalid, and enabled once every currently-relevant field (respecting Task 3's conditional rule) is valid.

**Acceptance criteria:**
- With all fields empty, the button is disabled.
- Filling `fullName` and a valid `email`, with the newsletter box unchecked, enables the button.
- Checking the newsletter box without filling `referralCode` disables the button again.

## Task 5 — Submit handling

Wire a submit handler that only runs when the form is valid (guard in code, don't rely solely on the disabled button). On submit, log the current form value and reset the model back to its initial empty state.

**Acceptance criteria:**
- Submitting a valid form logs the exact values you entered.
- After submit, all fields are visibly cleared and the submit button is disabled again.

---

## Optional stretch

Not required for this session — only if you finish early and want to go deeper:
- Replace the plain error text with `getError('kind')` and branch on error kind (`required` vs `email`) to show distinct messages.
- Add a `minDate`/`maxDate`-validated `dateOfBirth` field.

## Interview framing

Think through these out loud after building — no written answers here, this is the actual practice:

1. You used the `when`-option form for the conditional `referralCode` validator. What broke in pre-v22 signal forms that this syntax fixes, and what's the pre-v22 equivalent?
2. An interviewer asks: "Why not just use reactive forms with a custom cross-field validator for this?" What's your answer, specifically about how the two approaches expose state differently to the template?
3. Where in Task 2–4 did you rely on a signal (`.touched()`, `.invalid()`) composing directly with template state, versus something you'd have needed an `async` pipe or manual subscription for in reactive forms?
