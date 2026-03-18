import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-widget',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cart-widget.html',
  styleUrl: './cart-widget.css'
})
export class CartWidgetComponent {

  carrito = inject(CarritoService);

  open = signal(false);

  toggle(){
    this.open.update(v => !v);
  }

}