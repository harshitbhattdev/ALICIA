import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { BillingComponent } from './components/billing/billing.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'appointments', component: AppointmentsComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'services', component: DashboardComponent }, // Placeholder
  { path: 'customers', component: DashboardComponent }, // Placeholder
  { path: '**', redirectTo: '/dashboard' }
];
