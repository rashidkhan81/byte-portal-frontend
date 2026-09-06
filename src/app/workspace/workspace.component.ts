import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, UserRole } from '../auth/auth.service';
import { ApplicationResponse, ApplicationStatus, ConversationResponse, JobResponse } from '../api/api.models';
import { ApplicationService } from '../api/application.service';
import { ConversationService } from '../api/conversation.service';
import { JobService } from '../api/job.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent {
  readonly user = this.authService.getCurrentUser();
  readonly role: UserRole = this.route.snapshot.data['role'];
  readonly section = this.route.snapshot.data['section'] || 'Dashboard';
  readonly isSeeker = this.role === 'JOB_SEEKER';
  readonly isProvider = this.role === 'JOB_PROVIDER';
  readonly isAdmin = this.role === 'ADMIN';
  readonly jobId = Number(this.route.snapshot.paramMap.get('id')) || 0;
  jobs: JobResponse[] = [];
  applications: ApplicationResponse[] = [];
  conversations: ConversationResponse[] = [];
  providerApplications: ApplicationResponse[] = [];
  isLoading = false;
  apiError = '';
  unreadMessageCount = 0;

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly jobService: JobService,
    private readonly applicationService: ApplicationService,
    private readonly conversationService: ConversationService
  ) {
    this.loadSectionData();
    this.loadUnreadMessageCount();
  }

  messagesRoute(): string {
    return this.isProvider ? '/provider/messages' : '/seeker/messages';
  }

  private loadUnreadMessageCount(): void {
    this.conversationService.getMyConversations().subscribe({
      next: response => {
        const conversations = response.data?.content || [];
        if (!conversations.length) {
          this.unreadMessageCount = 0;
          return;
        }

        forkJoin(conversations.map(conversation => this.conversationService.getMessages(conversation.id))).subscribe({
          next: messageResponses => {
            const currentUserId = this.user?.id;
            this.unreadMessageCount = messageResponses.reduce(
              (total, messageResponse) => total + (messageResponse.data?.content || []).filter(message =>
                !message.read && String(message.senderId) !== String(currentUserId)
              ).length,
              0
            );
          }
        });
      }
    });
  }

  private loadSectionData(): void {
    this.isLoading = true;
    this.apiError = '';

    if (this.section === 'My Jobs') {
      this.jobService.getMyJobs().subscribe({
        next: response => this.jobs = response.data?.content || [],
        error: error => this.apiError = this.messageFor(error),
        complete: () => this.isLoading = false
      });
      return;
    }

    if (this.section === 'Applications' && this.isSeeker) {
      this.applicationService.getMyApplications().subscribe({
        next: response => this.applications = response.data?.content || [],
        error: error => this.apiError = this.messageFor(error),
        complete: () => this.isLoading = false
      });
      return;
    }

    if (this.section === 'Applications' && this.isProvider && this.jobId) {
      this.jobService.getApplications(this.jobId).subscribe({
        next: response => this.providerApplications = response.data?.content || [],
        error: error => this.apiError = this.messageFor(error),
        complete: () => this.isLoading = false
      });
      return;
    }

    if (this.section === 'Messages') {
      this.conversationService.getMyConversations().subscribe({
        next: response => this.conversations = response.data?.content || [],
        error: error => this.apiError = this.messageFor(error),
        complete: () => this.isLoading = false
      });
      return;
    }

    this.isLoading = false;
  }

  private messageFor(error: { error?: { message?: string } }): string {
    return error.error?.message || 'The BytePortal API could not be reached. Please try again.';
  }

  conversationFor(applicationId: number): ConversationResponse | undefined {
    return this.conversations.find(conversation => conversation.application?.id === applicationId);
  }

  updateApplicationStatus(application: ApplicationResponse, status: ApplicationStatus): void {
    this.applicationService.updateStatus(application.id, status).subscribe({
      next: response => { if (response.data) application.status = response.data.status; },
      error: error => this.apiError = this.messageFor(error)
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}
