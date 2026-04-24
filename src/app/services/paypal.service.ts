import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  private http = inject(HttpClient);
  private api = 'http://localhost:3000/api/paypal';

  crearOrden(data: any){
    return this.http.post<any>(`${this.api}/create-order`, data);
  }

  capturarOrden(orderId: string){
    return this.http.post<any>(`${this.api}/capture-order`, { orderId });
  }

}