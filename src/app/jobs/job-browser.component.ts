import { Component, OnInit } from '@angular/core';
import { JobResponse } from '../api/api.models';
import { JobService } from '../api/job.service';

@Component({
  selector: 'app-job-browser',
  templateUrl: './job-browser.component.html',
  styleUrls: ['./job-browser.component.scss']
})
export class JobBrowserComponent implements OnInit {
  jobs: JobResponse[] = [];
  search = '';
  page = 0;
  totalPages = 0;
  isLoading = true;
  errorMessage = '';

  constructor(private readonly jobService: JobService) {}

  ngOnInit(): void { this.loadJobs(); }

  loadJobs(): void {
    this.isLoading = true;
    this.jobService.list(this.page, 10, this.search).subscribe({
      next: response => {
        this.jobs = response.data?.content || [];
        this.totalPages = response.data?.totalPages || 0;
      },
      error: error => this.errorMessage = error.error?.message || 'Jobs could not be loaded.',
      complete: () => this.isLoading = false
    });
  }

  searchJobs(): void { this.page = 0; this.loadJobs(); }
  previousPage(): void { if (this.page > 0) { this.page--; this.loadJobs(); } }
  nextPage(): void { if (this.page + 1 < this.totalPages) { this.page++; this.loadJobs(); } }
}
