import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { VentasService } from '../../services/ventas.service';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-pedidos.html',
  styleUrls: ['./mis-pedidos.css']
})
export class MisPedidosComponent implements OnInit {

  ventasService = inject(VentasService);

  cdr = inject(ChangeDetectorRef);

  pedidos: any[] = [];

  loading = true;

  ngOnInit() {
  this.ventasService.obtenerVentasDetalle().subscribe({
    next: (data) => {
      const pedidosOrdenados = [...data].sort((a, b) => {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      });

      this.pedidos = pedidosOrdenados.map((pedido: any) => {
        const subtotalCalculado = pedido.productos.reduce(
          (acc: number, prod: any) => acc + Number(prod.precio) * Number(prod.cantidad),
          0
        );

        const ivaCalculado = subtotalCalculado * 0.16;
        const totalCalculado = subtotalCalculado + ivaCalculado;

        return {
          ...pedido,
          subtotal: subtotalCalculado,
          iva: ivaCalculado,
          total: totalCalculado
        };
      });

      this.loading = false;
      this.cdr.detectChanges();
      console.log("PEDIDOS:", this.pedidos);
    },

    error: (err) => {
      console.error(err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

}