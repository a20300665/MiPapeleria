import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartWidgetComponent } from './components/cart-widget/cart-widget';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CartWidgetComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}