import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  message = signal('');
  type = signal<'success' | 'error' | 'info'>('info');
  visible = signal(false);

  show(
  message: string, 
  type: 'success' | 'error' | 'info' = 'info',
  duration?: number
) {
  this.message.set(message);
  this.type.set(type);
  this.visible.set(true);

  // duración automática según tipo
  let time = duration;

  if (!time) {
    if (type === 'error') {
      time = 5000; // más tiempo para errores
    } else {
      time = 2500;
    }
  }

  setTimeout(() => {
    this.visible.set(false);
  }, time);
}

}