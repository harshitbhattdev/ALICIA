import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  title = 'Alicia Beauty Art';
  isMobileMenuOpen = false;

  constructor(private router: Router) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeMobileMenu();
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}
