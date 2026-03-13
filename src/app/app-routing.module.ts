import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AdminComponent } from './features/admin/admin.component';
import { StudentComponent } from './features/student/student.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { VideoTutorialsComponent } from './features/video-tutorials/video-tutorials.component';
import { LiveStreamingComponent } from './features/live-streaming/live-streaming.component';
import { PlansComponent } from './features/plans/plans.component';
import { NotesComponent } from './features/notes/notes.component';
import { BookingComponent } from './features/booking/booking.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { 
    path: '', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', redirectTo: 'videotutorials', pathMatch: 'full' },
      { path: 'livestreaming', component: LiveStreamingComponent },
      { path: 'videotutorials', component: VideoTutorialsComponent },
      { path: 'plans', component: PlansComponent },
      { path: 'notes', component: NotesComponent },
      { path: 'bookings', component: BookingComponent },
      { 
        path: 'courses', 
        component: StudentComponent, 
        canActivate: [RoleGuard], 
        data: { role: 'student' } 
      },
      { 
        path: 'admin', 
        component: AdminComponent, 
        canActivate: [RoleGuard], 
        data: { role: 'admin' } 
      },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }