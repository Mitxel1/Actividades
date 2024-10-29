import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActividadesService } from 'src/app/services/actividades.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent {

  router = inject(Router);
  usuarioServices = inject(UsuariosService);
  actividadesService = inject(ActividadesService);
  actividades: any[] = [];  // Arreglo para almacenar las actividades asignadas al empleado
  mensaje: string | null = null;
  toastr = inject(ToastrService);
  
  ngOnInit(): void {
    this.cargarActividadesAsignadas();
  }

  // Cargar actividades asignadas al empleado
  cargarActividadesAsignadas() {
    this.actividadesService.obtenerActividadesPorUsuario() // Llama a la función que obtendrá las actividades
      .then(actividades => {
        this.actividades = actividades; // Almacena las actividades en la variable
      })
      .catch(error => {
        console.error('Error al cargar actividades asignadas:', error);
      });
  }


  // Actualizar estatus de la actividad
  actualizarEstatus(actividad: any) {
    if (actividad.status === 'Pendiente') {
      this.actividadesService.iniciarActividad(actividad._id)
        .then(() => {
          actividad.status = 'En Progreso'; // Actualiza el estado en el componente
          this.toastr.success('La actividad ha sido iniciada.');
        })
        .catch(error => {
          console.error('Error al iniciar la actividad:', error);
          this.toastr.error('Error al iniciar la actividad.');
        });
    } else if (actividad.status === 'En Progreso') {
      this.actividadesService.completarActividad(actividad._id)
        .then(() => {
          actividad.status = 'Completada'; // Actualiza el estado en el componente
          this.toastr.success('La actividad ha sido completada.');
        })
        .catch(error => {
          console.error('Error al completar la actividad:', error);
          this.toastr.error('Error al completar la actividad.');
        });
    }
  }
  
  
  onClickLogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }
}
