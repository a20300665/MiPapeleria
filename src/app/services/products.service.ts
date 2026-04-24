import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Product } from "../models/product.model";
import { HttpClient } from "@angular/common/http";
import { map, Observable, of } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable({providedIn: 'root'})
export class ProductsService{
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);

   getAll(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:3000/api/productos');
}

    // 🔹 MÉTODO FUTURO (API) — para cuando conectemos backend
    getAllFromApi(): Observable<Product[]>{
        return this.http.get<Product[]>('http://localhost:3000/api/productos');
    }

    private parseProductsXml(xmlText: string): Product[]{
        const parser= new DOMParser();
        const doc= parser.parseFromString(xmlText, 'application/xml');
        if(doc.getElementsByTagName('parsererror').length > 0) return[];

        return Array.from(doc.getElementsByTagName('product'))
        .map((node) => ({
            idProducto: this.getText(node, 'id'),
            nombre: this.getText(node, 'nombre'),
            precio: this.getNumber(node, 'precio'),
            descripcion: this.getText(node, 'descripcion'),
            estado: this.getText(node, 'estado'),
            cantidad: this.getNumber(node, 'cantidad'),
            imagen: this.getText(node, 'imagen') || null,
            fecha: this.getText(node, 'fecha'),
        }));
    }

    private getText(parent: Element, tag: string): string{
        return parent.getElementsByTagName(tag)[0]?.textContent?.trim() ?? '';
    }

    private getNumber(parent: Element, tag: string): number{
        const n= Number(this.getText(parent, tag));
        return Number.isFinite(n) ? n : 0;
    }

    private getBoolean(parent: Element, tag: string): boolean{
        const v= this.getText(parent, tag).toLowerCase();
        return v === 'true' || v === '1' || v === 'yes';
    }
}