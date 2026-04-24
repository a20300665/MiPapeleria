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

  async ngAfterViewInit(){

    const paypal: any = await loadScript({
      clientId: "ASq6PpMotnb7qi_s9c1NZQkzci97ajECBrnPVziSpSi0uidYzNvfB8doIk3mph8ALNqvjglWDKLBzh0k",
      currency: "MXN"
    });

    if (!paypal) {
      console.error('No se cargó PayPal');
      return;
    }

    paypal.Buttons({

      // 🔥 CREAR ORDEN (BACKEND)
      createOrder: async () => {
        try {
          const response = await firstValueFrom(
            this.paypalService.crearOrden({
              items: this.carrito.items(),
              total: this.carrito.total()
            })
          );

          console.log("🟢 ORDEN CREADA:", response);

          return response.id;

        } catch (error) {
          console.error('❌ Error al crear orden:', error);
          alert('Error al crear la orden');
          throw error;
        }
      },

      // ======================================================
      // 🔥🔥🔥 INICIO onApprove 🔥🔥🔥
      // ======================================================
      onApprove: async (data: any) => {

        console.log("🔥 Entró a onApprove");

        try {

          console.log("👉 ID orden:", data.orderID);

          // 1️⃣ CAPTURAR PAGO
          const capture = await firstValueFrom(
            this.paypalService.capturarOrden(data.orderID)
          );

          console.log('✅ Pago capturado:', capture);

          // 2️⃣ DEBUG DATOS
          console.log("🟡 Intentando guardar venta...");
          console.log("📦 Productos:", this.carrito.items());
          console.log("💰 Total:", this.carrito.total());

          // 3️⃣ GUARDAR EN BASE DE DATOS
          const response = await firstValueFrom(
            this.ventasService.guardarVenta({
              productos: this.carrito.items(),
              total: this.carrito.total(),
              metodo_pago: 'PayPal',
              id_transaccion: data.orderID
            })
          );

          console.log("🟢 RESPUESTA BACKEND:", response);

          // 4️⃣ MENSAJE
          alert("Pago realizado correctamente 💖");

          // 5️⃣ HISTORIAL LOCAL
          this.historial.agregarCompra(
            this.carrito.items(),
            this.carrito.total()
          );

          // 6️⃣ EXPORTAR XML
          this.carrito.exportXML("PayPal");

          // 7️⃣ LIMPIAR CARRITO
          this.carrito.clearCart();

        } catch (error) {
          console.error('❌ ERROR COMPLETO:', error);
          alert("Error al procesar el pago");
        }

      },
      // ======================================================
      // 🔥🔥🔥 FIN onApprove 🔥🔥🔥
      // ======================================================

      // ❌ CANCELADO
      onCancel: () => {
        console.log("⚠️ Pago cancelado");
        alert('Pago cancelado');
      },

      // ❌ ERROR GENERAL
      onError: (err: any) => {
        console.error('❌ Error PayPal:', err);
        alert('Error en PayPal');
      }

    }).render("#paypal-button-container");

  }

}