import { Component, Input, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: []
})
export class SidebarComponent {
  private auth = inject(AuthService);

  @Input() set isSidebarCollapsed(value: boolean) {
    this.collapsed.set(value);
  }

  collapsed = signal(false);
  isAdmin = computed(() => this.auth.isAdmin());

  // Navigation items
  navItems = signal([
    { label: 'Garaje', path: '/', icon: '🏍️' },
    { label: 'Mantenimiento', path: '/mantenimiento', icon: '🛠️' },
    { label: 'Perfil', path: '/perfil', icon: '👤' },
    { label: 'Componentes', path: '/componentes', icon: '🔧' },
    { label: 'Configuración', path: '/settings', icon: '⚙️' },
  ]);

  logout() {
    this.auth.logout();
  }
}