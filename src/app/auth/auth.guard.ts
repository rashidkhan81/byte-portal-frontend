import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService, UserRole } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/login']);
    }

    const allowedRoles = route.data['roles'] as UserRole[] | undefined;
    if (!allowedRoles || this.authService.hasAnyRole(allowedRoles)) {
      return true;
    }

    const roles = this.authService.getRoles();
    if (roles.length > 1) {
      return this.router.createUrlTree(['/workspace/select']);
    }

    switch (roles[0]) {
      case 'JOB_SEEKER': return this.router.createUrlTree(['/seeker/dashboard']);
      case 'JOB_PROVIDER': return this.router.createUrlTree(['/provider/dashboard']);
      case 'ADMIN': return this.router.createUrlTree(['/admin/dashboard']);
      default: return this.router.createUrlTree(['/login']);
    }
  }
}
