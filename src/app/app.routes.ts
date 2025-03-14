import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.service';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Eagerly loaded
  { path: 'signup', component: SignupComponent }, // Eagerly loaded
  { path: 'resetpassword', component: ResetPasswordComponent }, // Eagerly loaded
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'sidebar',
    loadComponent: () => import('./sidebar/sidebar.component').then(m => m.SidebarComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'testimonials',
    loadComponent: () => import('./testimonials/testimonials.component').then(m => m.TestimonialsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'properties',
    loadComponent: () => import('./properties/properties.component').then(m => m.PropertiesComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'view-properties',
    loadComponent: () => import('./view-properties/view-properties.component').then(m => m.ViewPropertiesComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'site-visit',
    loadComponent: () => import('./site-visit/site-visit.component').then(m => m.SiteVisitComponent),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' }, // Fallback
];