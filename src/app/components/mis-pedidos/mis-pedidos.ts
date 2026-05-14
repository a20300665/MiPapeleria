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

  ngOnInit(){

    this.ventasService.obtenerVentasDetalle().subscribe({

      next: (data) => {

        this.pedidos = [...data];

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