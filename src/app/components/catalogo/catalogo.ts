import { Component, computed, inject, signal } from '@angular/core';
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
export class CatalogoComponent {

  private productsService = inject(ProductsService);
  carrito = inject(CarritoService);

  // Productos
  products = toSignal(
    this.productsService.getAll(),
    { initialValue: [] }
  );

  // Texto de búsqueda
  search = signal('');

  // Categoría seleccionada
  categoriaSeleccionada = signal('Todas');

  // Precio seleccionado
  precioSeleccionado = signal('Todos');

  // Categorías
  categorias = [
    'Todas',
    'Papeleria Escolar',
    'Oficina',
    'Arte y Manualidades',
    'Tecnologia',
    'Mobiliario'
  ];

  // Rangos de precio
  precios = [
    'Todos',
    'Menos de $50',
    '$50 - $100',
    'Más de $100'
  ];

  // Productos filtrados
  filteredProducts = computed(() => {

    const text = this.search().toLowerCase();
    const categoria = this.categoriaSeleccionada();
    const precio = this.precioSeleccionado();

    return this.products().filter(product => {

      // Filtro búsqueda
      const coincideBusqueda =
        product.nombre.toLowerCase().includes(text);

      // Filtro categoría
      const coincideCategoria =
        categoria === 'Todas' ||
        product.categoria === categoria;

      // Filtro precio
      let coincidePrecio = true;

      if(precio === 'Menos de $50'){
        coincidePrecio = product.precio < 50;
      }

      if(precio === '$50 - $100'){
        coincidePrecio =
          product.precio >= 50 &&
          product.precio <= 100;
      }

      if(precio === 'Más de $100'){
        coincidePrecio = product.precio > 100;
      }

      return (
        coincideBusqueda &&
        coincideCategoria &&
        coincidePrecio
      );

    });

  });

}