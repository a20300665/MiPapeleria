import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasService } from '../../services/ventas.service';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-pedidos.html',
  styleUrls: ['./mis-pedidos.css'] // 👈 AQUÍ EL FIX
})
export class MisPedidosComponent implements OnInit {

  ventasService = inject(VentasService);

  pedidos: any[] = [];

  ngOnInit(){
    this.ventasService.obtenerVentasDetalle().subscribe(data => {
  console.log("PEDIDOS DETALLE:", data);
  this.pedidos = data;
});
  }

}