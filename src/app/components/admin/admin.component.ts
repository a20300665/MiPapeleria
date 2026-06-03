import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  vista: 'productos' | 'categorias' = 'productos';

  productos: any[] = [];
  categorias: any[] = [];

  editandoProducto: any = null;
  editandoCategoria: any = null;

  productoForm = {
    id_producto: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagen: '',
    id_categoria: ''
  };

  categoriaForm = {
    id_categoria: '',
    nombre_categoria: '',
    descripcion: '',
    estado: 'activa'
  };

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos(): void {
    this.adminService.getProductos().subscribe({
      next: (data) => {
        this.productos = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
      }
    });
  }

  cargarCategorias(): void {
    this.adminService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  cambiarVista(vista: 'productos' | 'categorias'): void {
    this.vista = vista;

    if (vista === 'productos') {
      this.cargarProductos();
    } else {
      this.cargarCategorias();
    }

    this.limpiarFormularios();
    this.cdr.detectChanges();
  }

  limpiarFormularios(): void {
    this.editandoProducto = null;
    this.editandoCategoria = null;

    this.productoForm = {
      id_producto: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      imagen: '',
      id_categoria: ''
    };

    this.categoriaForm = {
      id_categoria: '',
      nombre_categoria: '',
      descripcion: '',
      estado: 'activa'
    };
  }

  seleccionarProducto(p: any): void {
    this.vista = 'productos';
    this.editandoProducto = p;

    this.productoForm = {
      id_producto: p.id_producto,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      stock: p.stock,
      imagen: p.imagen,
      id_categoria: p.id_categoria
    };

    this.cdr.detectChanges();
  }

  seleccionarCategoria(c: any): void {
    this.vista = 'categorias';
    this.editandoCategoria = c;

    this.categoriaForm = {
      id_categoria: c.id_categoria,
      nombre_categoria: c.nombre_categoria,
      descripcion: c.descripcion,
      estado: c.estado
    };

    this.cdr.detectChanges();
  }

  guardarProducto(): void {
    const accion = this.editandoProducto
      ? this.adminService.updateProducto(this.editandoProducto.id_producto, this.productoForm)
      : this.adminService.createProducto(this.productoForm);

    accion.subscribe({
      next: () => {
        this.cargarProductos();
        this.limpiarFormularios();
        this.vista = 'productos';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error guardando producto:', err);
      }
    });
  }

  eliminarProducto(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.adminService.deleteProducto(id).subscribe({
        next: () => {
          this.cargarProductos();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error eliminando producto:', err);
        }
      });
    }
  }

  guardarCategoria(): void {
    const accion = this.editandoCategoria
      ? this.adminService.updateCategoria(this.editandoCategoria.id_categoria, this.categoriaForm)
      : this.adminService.createCategoria(this.categoriaForm);

    accion.subscribe({
      next: () => {
        this.cargarCategorias();
        this.limpiarFormularios();
        this.vista = 'categorias';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error guardando categoría:', err);
      }
    });
  }

  eliminarCategoria(id: string): void {
    if (confirm('¿Seguro que deseas eliminar esta categoría?')) {
      this.adminService.deleteCategoria(id).subscribe({
        next: () => {
          this.cargarCategorias();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error eliminando categoría:', err);
        }
      });
    }
  }
}