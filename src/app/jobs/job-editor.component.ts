import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmploymentType, JobCreateRequest, JobStatus, JobUpdateRequest } from '../api/api.models';
import { JobService } from '../api/job.service';

@Component({ selector: 'app-job-editor', templateUrl: './job-editor.component.html', styleUrls: ['./job-editor.component.scss'] })
export class JobEditorComponent implements OnInit {
  jobId = 0;
  title = '';
  description = '';
  location = '';
  salary: number | null = null;
  employmentType: EmploymentType = 'FULL_TIME';
  status: JobStatus = 'OPEN';
  employmentTypes: EmploymentType[] = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE'];
  statuses: JobStatus[] = ['OPEN', 'DRAFT', 'CLOSED'];
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly jobService: JobService) {}

  ngOnInit(): void {
    this.jobId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    if (this.jobId) {
      this.isLoading = true;
      this.jobService.getById(this.jobId).subscribe({
        next: response => { const job = response.data; if (job) { this.title = job.title; this.description = job.description; this.location = job.location; this.salary = job.salary; this.employmentType = job.employmentType; this.status = job.status; } },
        error: error => this.errorMessage = error.error?.message || 'Job could not be loaded.',
        complete: () => this.isLoading = false
      });
    }
  }

  save(): void {
    if (!this.title.trim() || !this.employmentType || !this.status) { this.errorMessage = 'Title, employment type, and status are required.'; return; }
    this.isSaving = true; this.errorMessage = '';
    const baseRequest = { title: this.title.trim(), description: this.description.trim(), location: this.location.trim(), employmentType: this.employmentType, status: this.status };
    const request: JobCreateRequest | JobUpdateRequest = this.salary === null
      ? baseRequest
      : { ...baseRequest, salary: this.salary };
    const operation = this.jobId
      ? this.jobService.update(this.jobId, request as JobUpdateRequest)
      : this.jobService.create(request as JobCreateRequest);
    operation.subscribe({
      next: response => {
        if (!this.jobId && response.data) {
          this.router.navigate(['/provider/jobs']);
          return;
        }
        this.successMessage = response.message || 'Job saved.';
      },
      error: error => this.errorMessage = error.error?.message || 'Job could not be saved.',
      complete: () => this.isSaving = false
    });
  }

  delete(): void {
    if (!this.jobId || !confirm('Delete this job?')) return;
    this.jobService.delete(this.jobId).subscribe({ next: () => this.router.navigate(['/provider/jobs']), error: error => this.errorMessage = error.error?.message || 'Job could not be deleted.' });
  }
}
