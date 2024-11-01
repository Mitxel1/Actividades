import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ActividadesService } from 'src/app/services/actividades.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuarioActual: any = null; // Variable para almacenar los datos del usuario
  router = inject(Router);
  showNavbar = false; // Variable para controlar la animación de la barra de navegación
  isDataLoaded = false; // Para controlar si los datos han sido cargados

  constructor(private actividadesService: ActividadesService) {
    // Suscribirse a los eventos de navegación
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Solo activar la animación si los datos están cargados
        if (this.isDataLoaded) {
          this.showNavbar = true; // Activar la animación
          setTimeout(() => {
            this.showNavbar = false; // Resetear para la próxima navegación
          }, 0);
        }
      }
    });
  }

  ngOnInit(): void {
    this.cargarUsuarioActual();
  }

  // Método para cargar los datos del usuario actual
  cargarUsuarioActual() {
    this.actividadesService.obtenerUsuarioActual()
      .then(usuario => {
        this.usuarioActual = usuario;
        this.isDataLoaded = true; // Marcar los datos como cargados
      })
      .catch(error => {
        console.error('Error al cargar los datos del usuario:', error);
      });
  };

  onClickLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}