import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: []
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  // Expose current user (readonly)
  user = this.auth.user.asReadonly();
  // Toggle for profile menu
  showMenu = signal(false);

  toggleMenu() {
    this.showMenu.update(v => !v);
  }

  logout() {
    this.auth.logout();
  }

  goToProfile() {
    this.router.navigate(['/perfil']);
  }
}