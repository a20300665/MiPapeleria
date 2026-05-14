import { Injectable, signal, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  items = signal<CartItem[]>([]);
  toast = inject(ToastService);

  addProduct(product: Product) {

    const current = this.items();

    const existing = current.find(
      i => i.product.idProducto === product.idProducto
    );

    if (existing) {

      if (existing.cantidad < product.cantidad) {

        existing.cantidad++;

        this.items.set([...current]);

        this.toast.show(
          'Producto agregado al carrito 🛒',
          'success'
        );

      } else {

        this.toast.show(
          'No puedes agregar más productos de los disponibles en stock.',
          'error'
        );

      }

    } else {

      if (product.cantidad > 0) {

        this.items.set([
          ...current,
          { product, cantidad: 1 }
        ]);

        this.toast.show(
          'Producto agregado al carrito 🛒',
          'success'
        );

      } else {

        this.toast.show(
          'Este producto está agotado.',
          'error'
        );

      }

    }

  }

  increase(idProducto: string) {

    const items = this.items();

    const item = items.find(
      i => i.product.idProducto === idProducto
    );

    if (item) {

      if (item.cantidad < item.product.cantidad) {

        item.cantidad++;

        this.items.set([...items]);

        this.toast.show(
          'Cantidad aumentada',
          'info'
        );

      } else {

        this.toast.show(
          'No hay suficiente stock disponible.',
          'error'
        );

      }

    }

  }

  decrease(idProducto: string) {

    const items = this.items();

    const item = items.find(
      i => i.product.idProducto === idProducto
    );

    if (item) {

      item.cantidad--;

      if (item.cantidad <= 0) {

        this.removeProduct(idProducto);

      } else {

        this.items.set([...items]);

        this.toast.show(
          'Cantidad reducida',
          'info'
        );

      }

    }

  }

  removeProduct(idProducto: string) {

    this.items.set(
      this.items().filter(
        item => item.product.idProducto !== idProducto
      )
    );

    this.toast.show(
      'Producto eliminado del carrito',
      'error'
    );

  }

  clearCart() {

    this.items.set([]);

    this.toast.show(
      'Carrito vaciado',
      'info'
    );

  }

  getCount() {

    return this.items().reduce(
      (total, item) => total + item.cantidad,
      0
    );

  }

  getSubtotal() {

    return this.items().reduce((acc, item) => {

      return acc + (
        Number(item.product.precio) *
        Number(item.cantidad)
      );

    }, 0);

  }

  getIVA() {

    return this.getSubtotal() * 0.16;

  }

  total() {

    return this.getSubtotal() + this.getIVA();

  }

  exportXML(metodoPago: string = "PUE") {

    const items = this.items();

    const fecha = new Date().toISOString();

    const subtotal = this.getSubtotal();

    const iva = this.getIVA();

    const total = this.total();

    let conceptosXML = '';

    items.forEach((item, index) => {

      const precio = Number(item.product.precio);

      const cantidad = Number(item.cantidad);

      const importe = precio * cantidad;

      const impuesto = importe * 0.16;

      conceptosXML += `

        <cfdi:Concepto
            ClaveProdServ="44121618"
            NoIdentificacion="${index + 1}"
            Cantidad="${cantidad.toFixed(2)}"
            ClaveUnidad="H87"
            Unidad="Pieza"
            Descripcion="${this.escapeXML(item.product.nombre)}"
            ValorUnitario="${precio.toFixed(2)}"
            Importe="${importe.toFixed(2)}"
            ObjetoImp="02">

            <cfdi:Impuestos>

                <cfdi:Traslados>

                    <cfdi:Traslado
                        Base="${importe.toFixed(2)}"
                        Impuesto="002"
                        TipoFactor="Tasa"
                        TasaOCuota="0.160000"
                        Importe="${impuesto.toFixed(2)}"/>

                </cfdi:Traslados>

            </cfdi:Impuestos>

        </cfdi:Concepto>

      `;

    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>

<cfdi:Comprobante
    xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"

    Version="4.0"

    Serie="A"

    Folio="1"

    Fecha="${fecha}"

    Sello="SELLO_NO_DISPONIBLE"

    FormaPago="31"

    NoCertificado="NO_CERTIFICADO"

    Certificado="CERTIFICADO_NO_DISPONIBLE"

    SubTotal="${subtotal.toFixed(2)}"

    Moneda="MXN"

    Total="${total.toFixed(2)}"

    TipoDeComprobante="I"

    Exportacion="01"

    MetodoPago="${metodoPago}"

    LugarExpedicion="45010">

    <cfdi:Emisor

        Rfc="RFC_NO_DISPONIBLE"

        Nombre="PAPELERIA CREATIVA SA DE CV"

        RegimenFiscal="601"/>

    <cfdi:Receptor

        Rfc="RFC_NO_DISPONIBLE"

        Nombre="CLIENTE GENERAL"

        DomicilioFiscalReceptor="44100"

        RegimenFiscalReceptor="605"

        UsoCFDI="G03"/>

    <cfdi:Conceptos>

${conceptosXML}

    </cfdi:Conceptos>

    <cfdi:Impuestos
        TotalImpuestosTrasladados="${iva.toFixed(2)}">

        <cfdi:Traslados>

            <cfdi:Traslado
                Base="${subtotal.toFixed(2)}"
                Impuesto="002"
                TipoFactor="Tasa"
                TasaOCuota="0.160000"
                Importe="${iva.toFixed(2)}"/>

        </cfdi:Traslados>

    </cfdi:Impuestos>

</cfdi:Comprobante>
`;

    const blob = new Blob(
      [xml],
      { type: 'application/xml' }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;

    a.download = 'ticket_compra.xml';

    a.click();

    URL.revokeObjectURL(url);

    this.toast.show(
      'Compra exportada correctamente',
      'success'
    );

  }

  private escapeXML(text: string): string {

    return text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');

  }

}