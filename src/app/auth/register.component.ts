import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserRole } from './auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role: UserRole = 'JOB_SEEKER';
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: error => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'We could not create your account. Please try again.';
      }
    });
  }
}
