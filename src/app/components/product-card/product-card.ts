import { Component, Input, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector:'app-product-card',
  standalone:true,
  imports:[CurrencyPipe],
  templateUrl:'./product-card.html',
  styleUrl:'./product-card.css'
})
export class ProductCardComponent{

@Input({required:true}) product!: Product;

private carrito = inject(CarritoService);

addToCart(){
  this.carrito.addProduct(this.product);
}

}