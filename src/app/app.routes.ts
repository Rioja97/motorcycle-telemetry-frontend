import { Routes } from '@angular/router';
import { GarageComponent } from './views/garage/garage.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './views/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: GarageComponent },
      { path: 'perfil', loadComponent: () => import('./views/profile/profile.component').then(m => m.ProfileComponent) },
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