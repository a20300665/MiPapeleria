import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartWidgetComponent } from '../cart-widget/cart-widget';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CartWidgetComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {}