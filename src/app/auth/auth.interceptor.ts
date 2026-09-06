import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private readonly refreshedToken = new BehaviorSubject<string | null>(null);

  constructor(private readonly authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('byteportal_access_token');
    if (!token || request.url.includes('/api/auth/')) {
      return next.handle(request);
    }

    if (this.authService.isAccessTokenExpired()) {
      return this.refreshAndRetry(request, next);
    }

    return next.handle(this.withToken(request, token)).pipe(
      catchError(error => {
        if (error.status !== 401) {
          return throwError(() => error);
        }
        return this.refreshAndRetry(request, next);
      })
    );
  }

  private refreshAndRetry(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!localStorage.getItem('byteportal_refresh_token')) {
      this.authService.logout();
      window.location.href = '/login';
      return throwError(() => new Error('Session expired'));
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshedToken.next(null);
      return this.authService.refresh().pipe(
        switchMap(response => {
          const accessToken = response.data?.accessToken;
          if (!accessToken) {
            return throwError(() => new Error('Session refresh failed'));
          }
          this.refreshedToken.next(accessToken);
          return next.handle(this.withToken(request, accessToken));
        }),
        catchError(error => {
          this.authService.logout();
          this.refreshedToken.error(error);
          window.location.href = '/login';
          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    }

    return this.refreshedToken.pipe(
      filter(Boolean),
      take(1),
      switchMap(accessToken => next.handle(this.withToken(request, accessToken as string)))
    );
  }

  private withToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
}
