import { Routes } from '@angular/router';
import { GarageComponent } from './views/garage/garage.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { LoginComponent } from './views/auth/login.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
  {
    path: 'forgot-password',
    loadComponent: () => import('./views/auth/forgot-password.component').then(m => m.ForgotPasswordComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./views/auth/reset-password.component').then(m => m.ResetPasswordComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'ayuda',
    loadComponent: () => import('./views/help/help.component').then(m => m.HelpComponent),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: GarageComponent },
      {
        path: 'flota',
        loadComponent: () => import('./views/fleet/fleet.component').then(m => m.FleetComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'admins',
        loadComponent: () => import('./views/admins/admin-view.component').then(m => m.AdminViewComponent),
        canActivate: [adminGuard]
      },
      { path: 'perfil', loadComponent: () => import('./views/profile/profile.component').then(m => m.ProfileComponent) },
      {
        path: 'componentes',
        loadComponent: () => import('./views/catalog/catalog-view.component').then(m => m.CatalogViewComponent),
      },
      {
        path: 'mantenimiento',
        loadComponent: () => import('./views/maintenance/maintenance-view.component').then(m => m.MaintenanceViewComponent),
      },
        {
          path: 'motorbike/:id',
          loadComponent: () => import('./views/dashboard/dashboard.component').then(m => m.DashboardComponent),
          children: [
            { path: '', loadComponent: () => import('./views/dashboard/dashboard-view/dashboard-view.component').then(m => m.DashboardViewComponent) },
            { path: 'alertas', loadComponent: () => import('./views/dashboard/dashboard-alerts/alerts-view.component').then(m => m.AlertsViewComponent) },
            { path: 'mantenimiento', loadComponent: () => import('./views/dashboard/dashboard-maintenance/maintenance-history.component').then(m => m.MaintenanceHistoryComponent) }
          ]
        }
    ]
  }
];
