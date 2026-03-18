import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  items = signal<CartItem[]>([]);

  addProduct(product: Product){

    const current = this.items();

    const existing = current.find(
      i => i.product.idProducto === product.idProducto
    );

    if(existing){

      existing.cantidad++;

      this.items.set([...current]);

    }else{

      this.items.set([
        ...current,
        {product, cantidad:1}
      ]);

    }

  }

  increase(idProducto: string){

    const items = this.items();

    const item = items.find(
      i => i.product.idProducto === idProducto
    );

    if(item){
      item.cantidad++;
      this.items.set([...items]);
    }

  }

  decrease(idProducto: string){

    const items = this.items();

    const item = items.find(
      i => i.product.idProducto === idProducto
    );

    if(item){

      item.cantidad--;

      if(item.cantidad <= 0){

        this.removeProduct(idProducto);

      }else{

        this.items.set([...items]);

      }

    }

  }

  removeProduct(idProducto: string){

    this.items.set(
      this.items().filter(
        item => item.product.idProducto !== idProducto
      )
    );

  }

  clearCart(){

    this.items.set([]);

  }

  total(){

    return this.items().reduce(
      (sum,item)=> sum + item.product.precio * item.cantidad,
      0
    );

  }

  getCount(){

    return this.items().reduce(
      (total,item)=> total + item.cantidad,
      0
    );

  }

  exportXML(metodoPago: string = "Desconocido"){

    const items = this.items();

    const fecha = new Date().toISOString();

    let subtotal = 0;

    let productosXML = '';

    items.forEach(item => {

      const precio = item.product.precio;
      const cantidad = item.cantidad;
      const totalProducto = precio * cantidad;

      subtotal += totalProducto;

      productosXML += `
        <producto>
          <nombre>${item.product.nombre}</nombre>
          <precio>${precio}</precio>
          <cantidad>${cantidad}</cantidad>
          <total>${totalProducto}</total>
        </producto>
      `;

    });

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>

<ticket>

  <fecha>${fecha}</fecha>

  <metodo_pago>${metodoPago}</metodo_pago>

  <productos>

${productosXML}

  </productos>

  <subtotal>${subtotal.toFixed(2)}</subtotal>

  <iva>${iva.toFixed(2)}</iva>

  <total>${total.toFixed(2)}</total>

</ticket>
`;

    const blob = new Blob([xml], {type:'application/xml'});

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = 'ticket_compra.xml';

    a.click();

    URL.revokeObjectURL(url);

  }

}