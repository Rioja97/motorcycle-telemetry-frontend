import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar';
import { HeaderComponent } from '../header/header';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { signal } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './main-layout.html',
  styleUrls: []
})
export class MainLayoutComponent {
  isSidebarCollapsed = signal(false);

  toggleSidebar() {
    this.isSidebarCollapsed.update((current) => !current);
  }
}