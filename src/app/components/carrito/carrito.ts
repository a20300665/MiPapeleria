import { Component, inject } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { CurrencyPipe } from '@angular/common';
import { PaypalComponent } from '../paypal/paypal';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe, PaypalComponent,RouterLink],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css']
})
export class CarritoComponent {

  carrito = inject(CarritoService);

}