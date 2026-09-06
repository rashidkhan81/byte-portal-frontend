import { Component } from '@angular/core';
import { JobResponse } from '../api/api.models';
import { JobService } from '../api/job.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  searchQuery = '';
  locationQuery = '';
  jobs: JobResponse[] = [];
  jobsPage = 0;
  jobsTotalPages = 0;
  jobsLoading = true;
  jobsError = '';

  constructor(private readonly jobService: JobService) {
    this.loadJobs();
  }

  searchJobs(): void {
    this.jobsPage = 0;
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobsLoading = true;
    this.jobsError = '';
    this.jobService.list(this.jobsPage, 6, this.searchQuery).subscribe({
      next: response => {
        this.jobs = response.data?.content || [];
        this.jobsTotalPages = response.data?.totalPages || 0;
      },
      error: error => this.jobsError = error.error?.message || 'Open jobs could not be loaded.',
      complete: () => this.jobsLoading = false
    });
  }

  previousJobsPage(): void {
    if (this.jobsPage > 0) {
      this.jobsPage--;
      this.loadJobs();
    }
  }

  nextJobsPage(): void {
    if (this.jobsPage + 1 < this.jobsTotalPages) {
      this.jobsPage++;
      this.loadJobs();
    }
  }
}
