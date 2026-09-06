import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserRole } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
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
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        const roles = this.authService.getRoles();
        if (roles.length > 1) {
          this.router.navigate(['/workspace/select']);
          return;
        }

        const role = roles[0] || null;
        const destination = this.dashboardForRole(role);

        if (!destination) {
          this.authService.logout();
          this.isSubmitting = false;
          this.errorMessage = 'Your account does not have a supported workspace role.';
          return;
        }

        this.router.navigate([destination]);
      },
      error: error => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'We could not sign you in. Check your details and try again.';
      }
    });
  }

  private dashboardForRole(role: UserRole | null): string | null {
    switch (role) {
      case 'JOB_SEEKER': return '/seeker/dashboard';
      case 'JOB_PROVIDER': return '/provider/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return null;
    }
  }
}
