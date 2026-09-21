import { Component, signal } from '@angular/core';
import { email, form, hidden, required, FormField } from '@angular/forms/signals';

interface SignupFormModel {
  fullName: string;
  email: string;
  newsletterOptIn: boolean;
  referralCode: string;
}
@Component({
  selector: 'app-signup-form',
  template: `
    <div class="form-container">
      <form>
        <div>
          <label for="FULL_NAME">Fullname</label>
          <input type="text" id="FULL_NAME" [formField]="signupForm.fullName" />
          @if (signupForm.fullName().invalid() && signupForm.fullName().touched()) {
            @for (error of signupForm.fullName().errors(); track error) {
              <p class="required-error">{{ error.message }}</p>
            }
          }
        </div>
        <div>
          <label for="EMAIL">Email</label>
          <input type="email" id="EMAIL" [formField]="signupForm.email" />
          @if (signupForm.email().touched()) {
            @if (signupForm.email().getError('required'); as err) {
              <p class="required-error">{{ err.message }}</p>
            }
            @else if (signupForm.email().getError('email'); as err) {
              <p class="required-error">{{ err.message }}</p>
            }
          }
        </div>
        <div>
          <label for="NEWS_LETTER_OPT_IN">NewsletterOpIn</label>
          <input
            type="checkbox"
            id="NEWS_LETTER_OPT_IN"
            [formField]="signupForm.newsletterOptIn"
            (change)="onNewsletterOptInChange()"
          />
        </div>

        @if (!signupForm.referralCode().hidden()) {
          <div>
            <label for="REFERRAL_CODE">Referral Code</label>
            <input type="text" id="REFERRAL_CODE" [formField]="signupForm.referralCode" />
            @if (signupForm.referralCode().invalid() && signupForm.referralCode().touched()) {
              <p class="required-error">Referral Code is required!</p>
            }
          </div>
        }

        <button type="button" [disabled]="signupForm().invalid()" (click)="onSubmit()">
          Submit
        </button>
      </form>
    </div>
  `,
  styles: `
    .form-container {
      width: min-content;
      display: flex;
      flex-direction: column;
    }

    .required-error {
      color: red;
    }
  `,
  imports: [FormField],
})
export class SignupForm {
  private readonly signupFormModel = signal<SignupFormModel>({
    fullName: '',
    email: '',
    newsletterOptIn: false,
    referralCode: '',
  });

  protected readonly signupForm = form(this.signupFormModel, (schema) => {
    required(schema.fullName, { message: 'Full name is required' });
    email(schema.email, { message: 'Please enter a valid email' });
    required(schema.email, { message: 'Email is required' });
    required(schema.referralCode, { message: 'Referral code is required' });
    // `hidden` (not just the template @if) is what keeps referralCode's own
    // required-invalid state from counting toward the parent form's validity
    // while the user hasn't opted in — a hidden field doesn't contribute to
    // its parent's validation/touched/dirty state. This also means `required`
    // above can stay unconditional instead of duplicating this same check.
    hidden(schema.referralCode, {
      when: ({ valueOf }) => !valueOf(schema.newsletterOptIn),
    });
  });

  onNewsletterOptInChange(): void {
    // Only clear referralCode's touched/dirty when opting OUT: once it's hidden
    // again, a leftover "required" error shouldn't reappear pre-touched the next
    // time the user opts back in. Opting IN intentionally does NOT reset it —
    // if they'd already typed a code before unchecking, there's no reason to
    // discard it.
    if (!this.signupForm.newsletterOptIn().value()) {
      this.signupForm.referralCode().reset();
    }
  }

  onSubmit() {
    if (this.signupForm().invalid()) return;

    console.log(this.signupForm().value());
    this.signupForm().reset({
      fullName: '',
      email: '',
      newsletterOptIn: false,
      referralCode: '',
    });
  }
}
