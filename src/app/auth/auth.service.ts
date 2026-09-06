import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export type UserRole = 'JOB_SEEKER' | 'JOB_PROVIDER' | 'ADMIN';

export interface UserResponse {
  id?: number;
  name?: string;
  email?: string;
  role?: UserRole;
  roles?: UserRole[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  tokenType: string;
  user: UserResponse;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    status: number;
    code: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
  role: UserRole;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessTokenKey = 'byteportal_access_token';
  private readonly refreshTokenKey = 'byteportal_refresh_token';
  private readonly userKey = 'byteportal_user';
  private readonly expiresAtKey = 'byteportal_access_expires_at';
  private readonly authUrl = `${environment.apiUrl}/api/auth`;

  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.authUrl}/login`, request).pipe(
      tap(response => this.saveSession(response.data))
    );
  }

  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.authUrl}/register`, request);
  }

  refresh(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    if (!refreshToken) {
      return throwError(() => new Error('Refresh token is missing'));
    }

    const request: RefreshTokenRequest = { refreshToken };
    return this.http.post<ApiResponse<AuthResponse>>(`${this.authUrl}/refresh`, request).pipe(
      tap(response => this.saveSession(response.data))
    );
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.expiresAtKey);
  }

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(this.accessTokenKey));
  }

  isAccessTokenExpired(): boolean {
    const expiresAt = Number(localStorage.getItem(this.expiresAtKey));
    return !expiresAt || Date.now() >= expiresAt;
  }

  getCurrentUser(): UserResponse | null {
    const storedUser = localStorage.getItem(this.userKey);
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as UserResponse;
    } catch {
      this.logout();
      return null;
    }
  }

  getRoles(): UserRole[] {
    const user = this.getCurrentUser();
    if (!user) {
      return [];
    }

    if (user.roles?.length) {
      return user.roles;
    }

    return user.role ? [user.role] : [];
  }

  getRole(): UserRole | null {
    return this.getRoles()[0] || null;
  }

  hasRole(role: UserRole): boolean {
    return this.getRoles().includes(role);
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  private saveSession(authResponse?: AuthResponse): void {
    if (!authResponse) {
      return;
    }

    localStorage.setItem(this.accessTokenKey, authResponse.accessToken);
    localStorage.setItem(this.refreshTokenKey, authResponse.refreshToken);
    localStorage.setItem(this.userKey, JSON.stringify(authResponse.user));
    localStorage.setItem(this.expiresAtKey, String(Date.now() + authResponse.accessTokenExpiresIn * 1000));
  }
}
