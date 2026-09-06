import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobResponse } from '../api/api.models';
import { ApplicationService } from '../api/application.service';
import { JobService } from '../api/job.service';
import { AuthService } from '../auth/auth.service';

@Component({ selector: 'app-job-detail', templateUrl: './job-detail.component.html', styleUrls: ['./job-detail.component.scss'] })
export class JobDetailComponent implements OnInit {
  job: JobResponse | null = null;
  coverLetter = '';
  isLoading = true;
  isSubmitting = false;
  applied = false;
  errorMessage = '';
  successMessage = '';

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly jobService: JobService, private readonly applicationService: ApplicationService, private readonly authService: AuthService) {}

  ngOnInit(): void {
    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    this.jobService.getById(jobId).subscribe({ next: response => this.job = response.data || null, error: error => this.errorMessage = error.error?.message || 'Job could not be loaded.', complete: () => this.isLoading = false });
  }

  apply(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.authService.hasRole('JOB_SEEKER')) {
      this.errorMessage = 'Only job seekers can apply for jobs.';
      return;
    }

    if (!this.job || !this.coverLetter.trim()) { this.errorMessage = 'Please add a cover letter before applying.'; return; }
    this.isSubmitting = true;
    this.applicationService.apply({ jobId: this.job.id, coverLetter: this.coverLetter.trim() }).subscribe({
      next: () => { this.applied = true; this.successMessage = 'Application submitted successfully.'; },
      error: error => this.errorMessage = error.error?.message || 'Application could not be submitted.',
      complete: () => this.isSubmitting = false
    });
  }

  back(): void { this.router.navigate(['/jobs']); }
}
