import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private http = inject(HttpClient);
  private api = 'http://localhost:3000/api/ventas';

  obtenerVentasDetalle(){
  return this.http.get<any[]>(`${this.api}/detalle`);
  }
  obtenerVentas(){
  return this.http.get<any[]>(this.api);
  }
  guardarVenta(data: any){
    return this.http.post(this.api, data);
  }
  
}