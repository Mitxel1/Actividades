import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadesService } from 'src/app/services/actividades.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  actividades: any[] = [];  // Almacena las actividades creadas
  actividadSeleccionada: any = null;  // Actividad seleccionada para editar
  mensaje: string | null = null;
  // Agrega las propiedades de filtro
  statusFilter: string = '';
  employeeNameFilter: string = '';

  constructor(
    private router: Router,
    private usuarioServices: UsuariosService,
    private actividadesService: ActividadesService,
    private toastr : ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarActividades();  // Cargar las actividades cuando se inicializa el componente
    this.cargarActividadesUsuario();
  }

  //Car
  cargarActividadesUsuario(): void {
    this.actividadesService.filtrarActividades(this.statusFilter, this.employeeNameFilter)
      .then(actividades => {
        this.actividades = actividades || [];;
      })
      .catch(error => console.error(error));
  }

  // Cargar actividades creadas por el usuario
  cargarActividades(): void {
    this.actividadesService.obtenerActividadesPorUsuario()
      .then(actividades => {
        this.actividades = actividades; // Almacenar las actividades
      })
      .catch(error => {
        console.error('Error al cargar actividades:', error);
        this.mensaje = 'Error al cargar actividades.';
      });
  }

  // Función para seleccionar una actividad para editar
  seleccionarActividad(actividad: any): void {
    this.actividadSeleccionada = { ...actividad };  // Clonar la actividad seleccionada
  }

  // Editar la actividad seleccionada
  editarActividad(): void {
    if (this.actividadSeleccionada) {
      this.actividadesService.actualizarActividad(this.actividadSeleccionada._id, this.actividadSeleccionada)
        .then(() => {
          this.toastr.success('Exitoso!', 'Actividad actualizada con éxito.!');
          this.cargarActividades();  // Recargar las actividades después de editar
          this.actividadSeleccionada = null;  // Limpiar la selección
        })
        .catch(error => {
          console.error('Error al actualizar la actividad:', error);
          this.toastr.error('Error al actualizar la actividad.');
        });
    }
  }

  // Eliminar la actividad seleccionada
  eliminarActividad(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
      this.actividadesService.eliminarActividad(id)
        .then(() => {
          this.toastr.success('Exitoso!', 'Actividad eliminada con éxito.!');
          this.cargarActividades();  // Recargar actividades después de eliminar
        })
        .catch(error => {
          console.error('Error al eliminar la actividad:', error);
          this.toastr.error('Error al eliminar la actividad.');
        });
    }
  }

  // Método de filtro para actividades
  get filteredActividades() {
    return this.actividades.filter(actividad => 
      (this.statusFilter ? actividad.status === this.statusFilter : true) &&
      (this.employeeNameFilter ? actividad.assignedTo.nombre.includes(this.employeeNameFilter) : true)
    );
  }

  // Cerrar sesión
  onClickLogout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}