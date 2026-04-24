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

  cantidad: number = 1;

  increase(){
    if(this.cantidad < this.product.cantidad){
      this.cantidad++;
    }
  }

  decrease(){
    if(this.cantidad > 1){
      this.cantidad--;
    }
  }

  onInputChange(event: any){
    let value = Number(event.target.value);

    if(isNaN(value) || value < 1){
      value = 1;
    }

    if(value > this.product.cantidad){
      value = this.product.cantidad;
    }

    this.cantidad = value;
  }

  addToCart(){
    for(let i = 0; i < this.cantidad; i++){
      this.carrito.addProduct(this.product);
    }
  }

}