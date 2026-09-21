import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignupForm } from "./signup-form/signup-form";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SignupForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('new-angular');
}
