import { CarritoComponent } from './components/carrito/carrito';
import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo';
import { MisPedidosComponent } from './components/mis-pedidos/mis-pedidos';


export const routes: Routes = [
    { path: '', component: CatalogoComponent},
    { path:'carrito', component: CarritoComponent },
    {
  path: 'mis-pedidos',
  component: MisPedidosComponent
    },
    { path: '**', redirectTo:''} //siempre al final
    
];
