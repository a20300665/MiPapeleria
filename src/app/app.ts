import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartWidgetComponent } from './components/cart-widget/cart-widget';
import { ToastComponent } from './components/toast/toast.component';
import { NavbarComponent } from './components/navbar/navbar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet,
    CartWidgetComponent,
    ToastComponent
    
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}