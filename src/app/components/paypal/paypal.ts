import { Component, AfterViewInit, inject } from '@angular/core';
import { loadScript } from '@paypal/paypal-js';
import { CarritoService } from '../../services/carrito.service';
import { HistorialService } from '../../services/historial.service';

@Component({
  selector: 'app-paypal',
  standalone: true,
  templateUrl: './paypal.html'
})
export class PaypalComponent implements AfterViewInit {

  carrito = inject(CarritoService);
  historial = inject(HistorialService);

  async ngAfterViewInit(){

    const paypal: any = await loadScript({
      clientId: "ASq6PpMotnb7qi_s9c1NZQkzci97ajECBrnPVziSpSi0uidYzNvfB8doIk3mph8ALNqvjglWDKLBzh0k",
      currency: "MXN"
    });

    if (!paypal) return;

    paypal.Buttons({

      createOrder: (data:any, actions:any) => {

        return actions.order.create({

          purchase_units: [{

            amount:{
              value: this.carrito.total().toFixed(2)
            }

          }]

        });

      },

      onApprove: async (data:any, actions:any) => {

        const details = await actions.order.capture();

        alert("Pago completado por " + details.payer.name.given_name);

        const productos = this.carrito.items();
        const total = this.carrito.total();

        // guardar compra en historial
        this.historial.agregarCompra(productos, total);

        // exportar ticket
        this.carrito.exportXML("PayPal");

        // limpiar carrito
        this.carrito.clearCart();

      }

    }).render("#paypal-button-container");

  }

}