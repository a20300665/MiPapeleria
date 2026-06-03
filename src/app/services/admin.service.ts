import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private api = 'http://localhost:3000/api/admin';

  // PRODUCTOS
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/productos`);
  }

  createProducto(data: any): Observable<any> {
    return this.http.post<any>(`${this.api}/productos`, data);
  }

  updateProducto(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.api}/productos/${id}`, data);
  }

  deleteProducto(id: string): Observable<any> {
    return this.http.delete<any>(`${this.api}/productos/${id}`);
  }

  // CATEGORÍAS
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/categorias`);
  }

  createCategoria(data: any): Observable<any> {
    return this.http.post<any>(`${this.api}/categorias`, data);
  }

  updateCategoria(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.api}/categorias/${id}`, data);
  }

  deleteCategoria(id: string): Observable<any> {
    return this.http.delete<any>(`${this.api}/categorias/${id}`);
  }
}