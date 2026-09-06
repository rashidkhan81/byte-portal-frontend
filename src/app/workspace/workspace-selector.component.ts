import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../auth/auth.service';

@Component({
  selector: 'app-workspace-selector',
  templateUrl: './workspace-selector.component.html',
  styleUrls: ['./workspace-selector.component.scss']
})
export class WorkspaceSelectorComponent {
  readonly user = this.authService.getCurrentUser();
  readonly roles = this.authService.getRoles();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  continueAs(role: UserRole): void {
    const destinations: Record<UserRole, string> = {
      JOB_SEEKER: '/seeker/dashboard',
      JOB_PROVIDER: '/provider/dashboard',
      ADMIN: '/admin/dashboard'
    };
    this.router.navigate([destinations[role]]);
  }
}
