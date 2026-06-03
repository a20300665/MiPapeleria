import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartWidgetComponent } from '../cart-widget/cart-widget';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CartWidgetComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {

  private auth = inject(AuthService);
  private router = inject(Router);

  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  logout() {
    this.auth.logout();
    this.menuOpen.set(false);
    this.router.navigate(['/login']);
  }

  get user() {
    return this.auth.getUser();
  }

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  get isAdmin() {
  return this.user?.rol === 'admin';
}
}