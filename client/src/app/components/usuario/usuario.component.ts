import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadesService } from 'src/app/services/actividades.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit{

  usuarioActual: any = null; // Variable para almacenar los datos del usuario
  router = inject(Router);

  constructor(private actividadesService: ActividadesService) {}

  ngOnInit(): void {
    this.cargarUsuarioActual();
  }

  // Método para cargar los datos del usuario actual
  cargarUsuarioActual() {
    this.actividadesService.obtenerUsuarioActual()
      .then(usuario => {
        this.usuarioActual = usuario;
      })
      .catch(error => {
        console.error('Error al cargar los datos del usuario:', error);
      });
  };

  onClickLogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }
}
