export type Role = 'JOB_SEEKER' | 'JOB_PROVIDER';
export type ApplicationStatus = 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'REJECTED' | 'INTERVIEW' | 'HIRED';
export type JobStatus = 'OPEN' | 'CLOSED' | 'DRAFT';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';

export interface AuditFields {
  id: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: { status: number; code: string };
  timestamp: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface UserResponse extends AuditFields {
  name: string;
  email: string;
  role: Role;
}

export interface JobResponse extends AuditFields {
  title: string;
  description: string;
  location: string;
  salary: number;
  employmentType: EmploymentType;
  status: JobStatus;
  provider: UserResponse;
}

export interface JobCreateRequest {
  title: string;
  description: string;
  location: string;
  salary: number | null;
  employmentType: EmploymentType;
  status: JobStatus;
}

export interface JobUpdateRequest {
  title?: string;
  description?: string;
  location?: string;
  salary?: number;
  employmentType?: EmploymentType;
  status?: JobStatus;
}

export interface ApplicationResponse extends AuditFields {
  job: JobResponse;
  jobSeeker: UserResponse;
  status: ApplicationStatus;
  coverLetter: string;
}

export interface ApplicationCreateRequest {
  jobId: number;
  coverLetter: string;
}

export interface ApplicationStatusUpdateRequest {
  status: ApplicationStatus;
}

export interface ConversationResponse extends AuditFields {
  application: ApplicationResponse;
  seeker: UserResponse;
  provider: UserResponse;
}

export interface MessageResponse extends AuditFields {
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  read: boolean;
}

export interface MessageRequest {
  content: string;
}
