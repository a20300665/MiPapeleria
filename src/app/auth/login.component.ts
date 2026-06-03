import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  template: `

<div class="auth-container">

  <div class="auth-card">

    <h1>Iniciar sesión</h1>

    <p class="subtitle">
      Accede a tu cuenta
    </p>

    <form (ngSubmit)="login()">

      <input
        type="email"
        placeholder="Correo"
        [(ngModel)]="correo"
        name="correo"
        required
      >

      <input
        type="password"
        placeholder="Contraseña"
        [(ngModel)]="password"
        name="password"
        required
      >

      <button type="submit">
        Entrar
      </button>

    </form>

    @if(error()){

      <div class="error">

        {{error()}}

      </div>

    }

    <p class="link">

      ¿No tienes cuenta?

      <a routerLink="/register">
        Crear cuenta
      </a>

    </p>

  </div>

</div>

  `,
  styles: [`

.auth-container{

  min-height:100vh;

  display:flex;

  justify-content:center;
  align-items:center;

  background:#fff5fa;

  padding:20px;

}

.auth-card{

  width:100%;
  max-width:420px;

  background:white;

  padding:35px;

  border-radius:24px;

  box-shadow:0 10px 30px rgba(255,105,180,.15);

  border:2px solid #ffd6e8;

}

h1{

  margin:0;

  text-align:center;

  color:#d63384;

}

.subtitle{

  text-align:center;

  color:#888;

  margin-bottom:25px;

}

form{

  display:flex;
  flex-direction:column;

  gap:15px;

}

input{

  padding:14px;

  border:none;

  border-radius:14px;

  background:#fff0f6;

  outline:none;

}

button{

  border:none;

  padding:14px;

  border-radius:14px;

  background:linear-gradient(
    135deg,
    #ff9ecf,
    #ff6fb5
  );

  color:white;

  font-weight:bold;

  cursor:pointer;

  transition:.2s;

}

button:hover{

  transform:scale(1.03);

}

.error{

  margin-top:15px;

  color:#dc3545;

  text-align:center;

}

.link{

  margin-top:20px;

  text-align:center;

}

a{

  color:#d63384;

  font-weight:bold;

  text-decoration:none;

}

  `]
})
export class LoginComponent {

  private auth = inject(AuthService);

  private router = inject(Router);

  correo = '';

  password = '';

  error = signal('');

  login(){

    this.error.set('');

    this.auth.login({

      correo: this.correo,

      password: this.password

    }).subscribe({

      next: () => {

        this.router.navigate(['/']);

      },

      error: (err) => {

        console.error(err);

        this.error.set(
          err.error?.message ||
          'Error al iniciar sesión'
        );

      }

    });

  }

}