import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ContactComponent } from './contact/contact.component';
import { PropertiesComponent } from './properties/properties.component';
import { ViewPropertiesComponent } from './view-properties/view-properties.component';
import { SiteVisitComponent } from './site-visit/site-visit.component';
import { AuthGuard } from './services/auth.service';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'resetpassword', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'sidebar', component: SidebarComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'testimonials', component: TestimonialsComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: 'properties', component: PropertiesComponent, canActivate: [AuthGuard] },
  { path: 'view-properties', component: ViewPropertiesComponent, canActivate: [AuthGuard] },
  { path: 'site-visit', component: SiteVisitComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }, // Fallback
  
];
