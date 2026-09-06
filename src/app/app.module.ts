import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspaceSelectorComponent } from './workspace/workspace-selector.component';
import { ChatComponent } from './chat/chat.component';
import { JobBrowserComponent } from './jobs/job-browser.component';
import { JobDetailComponent } from './jobs/job-detail.component';
import { JobEditorComponent } from './jobs/job-editor.component';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    WorkspaceComponent,
    WorkspaceSelectorComponent,
    ChatComponent,
    JobBrowserComponent,
    JobDetailComponent,
    JobEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
