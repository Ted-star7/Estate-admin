import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { SidebarComponent } from './sidebar/sidebar.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'resetpassword', component: ResetPasswordComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'sidebar', component: SidebarComponent},
  { path: 'admin', component: AdminComponent},
  { path: 'testimonials', component: TestimonialsComponent},
  { path: '**', redirectTo: '' }, // Fallback
];
