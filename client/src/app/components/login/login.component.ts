import { Component, inject, Inject } from '@angular/core';
import { FormControl, FormGroup , FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  formulario: FormGroup;

  // Inyectar servicios
  private usuariosService = inject(UsuariosService);
  private router = inject(Router);

  constructor() {
    // Inicializar el formulario con validaciones
    this.formulario = new FormGroup({
      nombre: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  async onSubmit() {
    if (this.formulario.invalid) {
      return; // Salir si el formulario es inválido
    }

    try {
      const response = await this.usuariosService.login(this.formulario.value);
      // Almacenar el token y rol en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('rol', response.rol);

      // Redirigir al usuario según su rol
      switch (response.rol) {
        case 'admin':
          this.router.navigate(['/admin']); // Ruta para administrador
          break;
        case 'empleado':
          this.router.navigate(['/empleado']); // Ruta para empleado
          break;
    
      }
    } catch (error: any) {
      this.formulario.reset(); // Opcional: Reiniciar el formulario
      console.error('Error en el inicio de sesión:', error);
      // Mostrar el mensaje de error al usuario
      alert(error?.error?.error || 'Error en el inicio de sesión');
    }
  }
}