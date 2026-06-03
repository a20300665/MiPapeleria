import { Component, computed, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card';
import { ProductsService } from '../../services/products.service';
import { CarritoService } from '../../services/carrito.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css'],
})
export class CatalogoComponent implements OnInit {

  private productsService = inject(ProductsService);
  private cdr = inject(ChangeDetectorRef);
  carrito = inject(CarritoService);

  products = toSignal(
    this.productsService.getAll(),
    { initialValue: [] }
  );

  search = signal('');
  categoriaSeleccionada = signal('Todas');
  precioSeleccionado = signal('Todos');

  categorias = signal<string[]>(['Todas']);

  precios: string[] = [
    'Todos',
    'Menos de $50',
    '$50 - $100',
    'Más de $100'
  ];

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.productsService.getCategorias().subscribe({
      next: (data) => {
        const nombres = data
          .filter(cat => cat.estado === 'activa')
          .map(cat => cat.nombre_categoria);

        this.categorias.set(['Todas', ...nombres]);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  filteredProducts = computed(() => {
    const text = this.search().toLowerCase();
    const categoria = this.categoriaSeleccionada();
    const precio = this.precioSeleccionado();

    return this.products().filter(product => {
      const coincideBusqueda =
        product.nombre.toLowerCase().includes(text);

      const coincideCategoria =
        categoria === 'Todas' ||
        product.categoria === categoria;

      let coincidePrecio = true;

      if (precio === 'Menos de $50') {
        coincidePrecio = product.precio < 50;
      }

      if (precio === '$50 - $100') {
        coincidePrecio = product.precio >= 50 && product.precio <= 100;
      }

      if (precio === 'Más de $100') {
        coincidePrecio = product.precio > 100;
      }

      return coincideBusqueda && coincideCategoria && coincidePrecio;
    });
  });
}