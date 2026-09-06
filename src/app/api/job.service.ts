import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, JobCreateRequest, JobResponse, JobUpdateRequest, PagedResponse } from './api.models';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly url = `${environment.apiUrl}/api/jobs`;

  constructor(private readonly http: HttpClient) {}

  list(page = 0, size = 10, search = ''): Observable<ApiResponse<PagedResponse<JobResponse>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search.trim()) params = params.set('search', search.trim());
    return this.http.get<ApiResponse<PagedResponse<JobResponse>>>(this.url, { params });
  }

  getById(jobId: number): Observable<ApiResponse<JobResponse>> {
    return this.http.get<ApiResponse<JobResponse>>(`${this.url}/${jobId}`);
  }

  getMyJobs(page = 0, size = 10): Observable<ApiResponse<PagedResponse<JobResponse>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PagedResponse<JobResponse>>>(`${this.url}/my`, { params });
  }

  create(request: JobCreateRequest): Observable<ApiResponse<JobResponse>> {
    return this.http.post<ApiResponse<JobResponse>>(this.url, request);
  }

  update(jobId: number, request: JobUpdateRequest): Observable<ApiResponse<JobResponse>> {
    return this.http.put<ApiResponse<JobResponse>>(`${this.url}/${jobId}`, request);
  }

  delete(jobId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.url}/${jobId}`);
  }

  getApplications(jobId: number, page = 0, size = 10): Observable<ApiResponse<PagedResponse<import('./api.models').ApplicationResponse>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PagedResponse<import('./api.models').ApplicationResponse>>>(`${this.url}/${jobId}/applications`, { params });
  }
}
