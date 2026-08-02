import { Routes } from '@angular/router';
import { GarageComponent } from './views/garage/garage.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { LoginComponent } from './views/auth/login.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
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
      { path: 'perfil', loadComponent: () => import('./views/profile/profile.component').then(m => m.ProfileComponent) },
      {
        path: 'componentes',
        loadComponent: () => import('./views/catalog/catalog-view.component').then(m => m.CatalogViewComponent),
      },
        {
          path: 'motorbike/:id',
          loadComponent: () => import('./views/dashboard/dashboard.component').then(m => m.DashboardComponent),
          children: [
            { path: '', loadComponent: () => import('./views/dashboard/dashboard-view/dashboard-view.component').then(m => m.DashboardViewComponent) },
            { path: 'alertas', loadComponent: () => import('./views/dashboard/dashboard-alerts/alerts-view.component').then(m => m.AlertsViewComponent) },
            { path: 'mantenimiento', loadComponent: () => import('./views/dashboard/dashboard-maintenance/maintenance-view.component').then(m => m.MaintenanceViewComponent) }
          ]
        }
    ]
  }
];
