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
  actividades: any[] = [];
  mensaje: string | null = null;
  toastr = inject(ToastrService);
  notificaciones: any[] = [];

  ngOnInit(): void {
    this.cargarActividadesAsignadas();
  }


  cargarActividadesAsignadas() {
    this.actividadesService.obtenerActividadesPorUsuario()
      .then(actividades => {
        console.log('Actividades obtenidas:', actividades);
        this.actividades = actividades.map(actividad => ({
          ...actividad,
          mostrarBoton: actividad.status !== 'Completada' // Agregamos esta propiedad a cada actividad
        }));
        this.procesarNotificaciones();
      })
      .catch(error => {
        console.error('Error al cargar actividades asignadas:', error);
      });
  }

  procesarNotificaciones() {
    const actividadesPendientesOEnProceso = this.actividades.filter(
      actividad => actividad.status === 'Pendiente' || actividad.status === 'En Progreso'
    );

    if (actividadesPendientesOEnProceso.length > 0) {
      const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Empleado';
      const cantidadActividades = actividadesPendientesOEnProceso.length;
      const mensaje = `Hola ${nombreUsuario}, tienes ${cantidadActividades} actividad${cantidadActividades > 1 ? 'es' : ''} pendiente${cantidadActividades > 1 ? 's' : ''}.`;
      this.toastr.info(mensaje);
    } else {
      this.toastr.info('Todas tus actividades asignadas han sido completadas.');
    }
  }



  actualizarEstatus(actividad: any) {
    if (actividad.status === 'Pendiente') {
      this.iniciarActividad(actividad);
    } else if (actividad.status === 'En Progreso') {
      this.completarActividad(actividad);
    }
  }

  private iniciarActividad(actividad: any) {
    this.actividadesService.iniciarActividad(actividad._id)
      .then(() => {
        actividad.status = 'En Progreso';
        this.toastr.success('La actividad ha sido iniciada.');
      })
      .catch(error => {
        console.error('Error al iniciar la actividad:', error);
        this.toastr.error('Error al iniciar la actividad.');
      });
  }

  private completarActividad(actividad: any) {
    this.actividadesService.completarActividad(actividad._id)
      .then(() => {
        actividad.status = 'Completada';
        actividad.mostrarBoton = false; // Actualizamos la propiedad de la actividad específica
        this.toastr.success('La actividad ha sido completada.');
      })
      .catch(error => {
        console.error('Error al completar la actividad:', error);
        this.toastr.error('Error al completar la actividad.');
      });
  }

  // Nueva función: Redirigir al formulario de creación de reportes
  crearReporte(actividadId: string) {
    this.router.navigate(['/reporte/crear', actividadId]);
  } 

  onClickLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}