import { Routes } from '@angular/router';

import { CatalogoComponent } from './components/catalogo/catalogo';
import { CarritoComponent } from './components/carrito/carrito';
import { MisPedidosComponent } from './components/mis-pedidos/mis-pedidos';

import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [

  {
    path: '',
    component: CatalogoComponent
  },

  {
    path: 'carrito',
    component: CarritoComponent
  },

  {
    path: 'mis-pedidos',
    component: MisPedidosComponent,
    canActivate: [authGuard]
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
  path: 'privacidad',
  loadComponent: () =>
    import('./pages/privacidad/privacidad')
      .then(m => m.PrivacidadComponent)
},
{
  path: 'terminos',
  loadComponent: () =>
    import('./pages/terminos/terminos')
      .then(m => m.TerminosComponent)
},

  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./components/admin/admin.component')
        .then(m => m.AdminComponent)
  },

  {
    path: '**',
    redirectTo: ''
  }

];