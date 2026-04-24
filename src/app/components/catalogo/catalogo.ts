import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card';
import { ProductsService } from '../../services/products.service';
import { CarritoService } from '../../services/carrito.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css'],
})
export class CatalogoComponent {

  private productsService = inject(ProductsService);
  carrito = inject(CarritoService);

  products = toSignal(
    this.productsService.getAll(),
    { initialValue: [] }
  );

}