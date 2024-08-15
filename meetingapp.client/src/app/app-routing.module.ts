import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LandingComponent } from './landing/landing.component'; 
import { MeetingCreateComponent } from './meeting-create/meeting-create.component';  
import { MeetingsViewComponent } from './meetings-view/meetings-view.component'; 
import { AuthGuard } from './auth.guard';
import { EditMeetingComponent } from './edit-meeting/edit-meeting.component';

const routes: Routes = [
  { path: '', component: LandingComponent }, 
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'meetings/create', component: MeetingCreateComponent, canActivate: [AuthGuard] }, 
  { path: 'meetings', component: MeetingsViewComponent, canActivate: [AuthGuard] }, 
  { path: 'edit-meeting/:id', component: EditMeetingComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }  // Wildcard route for invalid URLs (redirect to Landing)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
