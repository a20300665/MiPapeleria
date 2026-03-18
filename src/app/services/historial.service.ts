import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

export interface Compra {
  id: number;
  fecha: string;
  productos: {
    product: Product;
    cantidad: number;
  }[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  private historial = signal<Compra[]>([]);

  getHistorial(){
    return this.historial;
  }

  agregarCompra(productos:any[], total:number){

    const nuevaCompra: Compra = {

      id: Date.now(),

      fecha: new Date().toLocaleString(),

      productos: productos,

      total: total

    };

    this.historial.update(h => [...h, nuevaCompra]);

  }

}