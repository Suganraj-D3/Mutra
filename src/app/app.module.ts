import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { MenuModule } from 'primeng/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AdminComponent } from './features/admin/admin.component';
import { StudentComponent } from './features/student/student.component';
import { LiveStreamingComponent } from './features/live-streaming/live-streaming.component';
import { VideoTutorialsComponent } from './features/video-tutorials/video-tutorials.component';
import { TopicModalComponent } from './features/student/topic-modal/topic-modal.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthService } from './core/auth/auth.service';
import { TokenInterceptor } from './core/auth/token.interceptor';
import { PlansComponent } from './features/plans/plans.component';
import { NotesComponent } from './features/notes/notes.component';
import { BookingComponent } from './features/booking/booking.component';

export function initializeApp(authService: AuthService) {
  return () => authService.initAuth();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    AdminComponent,
    StudentComponent,
    LiveStreamingComponent,
    VideoTutorialsComponent,
    TopicModalComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    PlansComponent,
    NotesComponent,
    BookingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MenuModule,
    TabMenuModule,
    FormsModule,
    ProgressBarModule,
    ToastModule,
    OAuthModule.forRoot()
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [AuthService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }