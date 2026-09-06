import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, ApplicationCreateRequest, ApplicationResponse, ApplicationStatus, PagedResponse } from './api.models';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly url = `${environment.apiUrl}/api/applications`;

  constructor(private readonly http: HttpClient) {}

  getById(applicationId: number): Observable<ApiResponse<ApplicationResponse>> {
    return this.http.get<ApiResponse<ApplicationResponse>>(`${this.url}/${applicationId}`);
  }

  getMyApplications(page = 0, size = 10): Observable<ApiResponse<PagedResponse<ApplicationResponse>>> {
    return this.http.get<ApiResponse<PagedResponse<ApplicationResponse>>>(`${this.url}/my`, {
      params: { page, size }
    });
  }

  apply(request: ApplicationCreateRequest): Observable<ApiResponse<ApplicationResponse>> {
    return this.http.post<ApiResponse<ApplicationResponse>>(this.url, request);
  }

  updateStatus(applicationId: number, status: ApplicationStatus): Observable<ApiResponse<ApplicationResponse>> {
    return this.http.patch<ApiResponse<ApplicationResponse>>(`${this.url}/${applicationId}/status`, { status });
  }
}
