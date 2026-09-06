import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { AuthGuard } from './auth/auth.guard';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspaceSelectorComponent } from './workspace/workspace-selector.component';
import { ChatComponent } from './chat/chat.component';
import { JobBrowserComponent } from './jobs/job-browser.component';
import { JobDetailComponent } from './jobs/job-detail.component';
import { JobEditorComponent } from './jobs/job-editor.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'workspace/select', component: WorkspaceSelectorComponent, canActivate: [AuthGuard] },
  { path: 'messages/:id', component: ChatComponent, canActivate: [AuthGuard], data: { roles: ['JOB_SEEKER', 'JOB_PROVIDER'] } },
  { path: 'jobs', component: JobBrowserComponent },
  { path: 'jobs/:id', component: JobDetailComponent },
  { path: 'seeker/dashboard', component: WorkspaceComponent, canActivate: [AuthGuard], data: { role: 'JOB_SEEKER', roles: ['JOB_SEEKER'], section: 'Dashboard' } },
  { path: 'seeker/profile', component: WorkspaceComponent, canActivate: [AuthGuard], data: { role: 'JOB_SEEKER', roles: ['JOB_SEEKER'], section: 'Profile' } },
  { path: 'seeker/applications', component: WorkspaceComponent, canActivate: [AuthGuard], data: { role: 'JOB_SEEKER', roles: ['JOB_SEEKER'], section: 'Applications' } },
  { path: 'seeker/jobs', component: JobBrowserComponent, canActivate: [AuthGuard], data: { role: 'JOB_SEEKER', roles: ['JOB_SEEKER'] } },
  { path: 'seeker/saved-jobs', component: WorkspaceComponent, canActivate: [AuthGuard], data: { role: 'JOB_SEEKER', roles: ['JOB_SEEKER'], section: 'Saved jobs' } },
  { path: 'seeker/messages', component: WorkspaceComponent, canActivate: [AuthGuard], data: { role: 'JOB_SEEKER', roles: ['JOB_SEEKER'], section: 'Messages' } },
  { path: 'provider/dashboard', component: WorkspaceComponent, canActivate: [AuthGuard], data: { role: 'JOB_PROVIDER', roles: ['JOB_PROVIDER'], section: 'Dashboard' } },
  { path: 'provider/jobs', component: WorkspaceComponent, canActivate: [AuthGuard], data: { role: 'JOB_PROVIDER', roles: ['JOB_PROVIDER'], section: 'My Jobs' } },
  { path: 'provider/jobs/new', component: JobEditorComponent, canActivate: [AuthGuard], data: { role: 'JOB_PROVIDER', roles: ['JOB_PROVIDER'] } },
  { path: 'provider/jobs/:id/edit', component: JobEditorComponent, canActivate: [AuthGuard], data: { role: 'JOB_PROVIDER', roles: ['JOB_PROVIDER'] } },
  { path: 'provider/jobs/:id', component: JobDetailComponent, canActivate: [AuthGuard], data: { role: 'JOB_PROVIDER', roles: ['JOB_PROVIDER'] } },
  { path: 'provider/jobs/:id/applications', component: WorkspaceComponent, canActivate: [AuthGuard], data: { role: 'JOB_PROVIDER', roles: ['JOB_PROVIDER'], section: 'Applications' } },
  { path: 'provider/profile', component: WorkspaceComponent, canActivate: [AuthGuard], data: { role: 'JOB_PROVIDER', roles: ['JOB_PROVIDER'], section: 'Company Profile' } },
  { path: 'provider/messages', component: WorkspaceComponent, canActivate: [AuthGuard], data: { role: 'JOB_PROVIDER', roles: ['JOB_PROVIDER'], section: 'Messages' } },
  { path: 'admin/dashboard', component: WorkspaceComponent, canActivate: [AuthGuard], data: { role: 'ADMIN', roles: ['ADMIN'], section: 'Dashboard' } },
  { path: 'admin/users', component: WorkspaceComponent, canActivate: [AuthGuard], data: { role: 'ADMIN', roles: ['ADMIN'], section: 'Users' } },
  { path: 'admin/jobs', component: WorkspaceComponent, canActivate: [AuthGuard], data: { role: 'ADMIN', roles: ['ADMIN'], section: 'Jobs' } },
  { path: 'admin/reports', component: WorkspaceComponent, canActivate: [AuthGuard], data: { role: 'ADMIN', roles: ['ADMIN'], section: 'Reports' } },
  { path: '**', redirectTo: '' }
];
