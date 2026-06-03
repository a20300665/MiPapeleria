import { Component, AfterViewInit, inject } from '@angular/core';
import { loadScript } from '@paypal/paypal-js';
import { CarritoService } from '../../services/carrito.service';
import { HistorialService } from '../../services/historial.service';
import { PaypalService } from '../../services/paypal.service';
import { VentasService } from '../../services/ventas.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-paypal',
  standalone: true,
  templateUrl: './paypal.html'
})
export class PaypalComponent implements AfterViewInit {

  carrito = inject(CarritoService);
  historial = inject(HistorialService);
  paypalService = inject(PaypalService);
  ventasService = inject(VentasService);

  async ngAfterViewInit() {

    const paypal: any = await loadScript({
      clientId: "AV8LCGWvzxcfstUBgNHEfM17ZsK7btmE7NrDxvADzh0ebNnvfZqJAsE7hv3bYx8yXVdaTWa-BskIDAjV",
      currency: "MXN"
    });

    if (!paypal) {
      console.error('No se cargó PayPal');
      return;
    }

    paypal.Buttons({

      // CREAR ORDEN
      createOrder: async () => {
        try {
          const response = await firstValueFrom(
            this.paypalService.crearOrden({
              items: this.carrito.items(),
              total: this.carrito.total()
            })
          );

          console.log("ORDEN CREADA:", response);

          return response.id;

        } catch (error) {
          console.error('Error al crear orden:', error);
          alert('Error al crear la orden');
          throw error;
        }
      },

      // CUANDO EL PAGO SE APRUEBA
      onApprove: async (data: any) => {
        console.log("Entró a onApprove");

        try {
          console.log("ID orden:", data.orderID);

          // 1. Capturar pago
          const capture = await firstValueFrom(
            this.paypalService.capturarOrden(data.orderID)
          );

          console.log('Pago capturado:', capture);

          // 2. Datos correctos
          const subtotal = this.carrito.getSubtotal();
          const iva = this.carrito.getIVA();
          const totalFinal = this.carrito.total();

          console.log("Intentando guardar venta...");
          console.log("Productos:", this.carrito.items());
          console.log("Subtotal:", subtotal);
          console.log("IVA:", iva);
          console.log("Total FINAL:", totalFinal);

          // 3. Guardar en base de datos
          const response = await firstValueFrom(
            this.ventasService.guardarVenta({
              productos: this.carrito.items(),
              subtotal: subtotal,
              iva: iva,
              total: totalFinal,
              metodo_pago: 'PayPal',
              id_transaccion: data.orderID
            })
          );

          console.log("RESPUESTA BACKEND:", response);

          // 4. Mensaje
          alert("Pago realizado correctamente 💖");

          // 5. Historial local
          this.historial.agregarCompra(
            this.carrito.items(),
            totalFinal
          );

          // 6. Exportar XML
          this.carrito.exportXML("PayPal");

          // 7. Limpiar carrito
          this.carrito.clearCart();

        } catch (error) {
          console.error('ERROR COMPLETO:', error);
          alert("Error al procesar el pago");
        }
      },

      // SI EL USUARIO CANCELA
      onCancel: async () => {
        try {
          const subtotal = this.carrito.getSubtotal();
          const iva = this.carrito.getIVA();
          const totalFinal = this.carrito.total();

          await firstValueFrom(
            this.ventasService.guardarPedidoCancelado({
              productos: this.carrito.items(),
              subtotal: subtotal,
              iva: iva,
              total: totalFinal,
              metodo_pago: 'PayPal',
              id_transaccion: 'CANCELADO'
            })
          );

          alert('Pago cancelado');
        } catch (error) {
          console.error(error);
          alert('Pago cancelado, pero no se pudo guardar el pedido');
        }
      },

      // SI OCURRE UN ERROR
      onError: async (err: any) => {
        console.error('Error PayPal:', err);

        try {
          const subtotal = this.carrito.getSubtotal();
          const iva = this.carrito.getIVA();
          const totalFinal = this.carrito.total();

          await firstValueFrom(
            this.ventasService.guardarPedidoCancelado({
              productos: this.carrito.items(),
              subtotal: subtotal,
              iva: iva,
              total: totalFinal,
              metodo_pago: 'PayPal',
              id_transaccion: 'ERROR'
            })
          );
        } catch (error) {
          console.error(error);
        }

        alert('Error en PayPal');
      }

    }).render("#paypal-button-container");

  }

}