import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private http = inject(HttpClient);
  private api = 'http://localhost:3000/api/ventas';

  guardarVenta(data: any) {
    return this.http.post<any>(`${this.api}`, data);
  }

  guardarPedidoCancelado(data: any) {
    return this.http.post<any>(`${this.api}/cancelado`, data);
  }

  obtenerVentas() {
    return this.http.get<any[]>(`${this.api}`);
  }

  obtenerVentasDetalle() {
    return this.http.get<any[]>(`${this.api}/detalle`);
  }
}