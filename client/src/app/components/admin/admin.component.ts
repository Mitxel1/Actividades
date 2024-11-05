import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadesService } from 'src/app/services/actividades.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  actividades: any[] = [];
  actividadSeleccionada: any = null;
  mensaje: string | null = null;
  filteredActividades: any[] = [];
  statusFilter: string = '';
  employeeNameFilter: string = '';
  loading: boolean = true;
  empleados: any[] = [];

  constructor(
    private router: Router,
    private usuarioServices: UsuariosService,
    private actividadesService: ActividadesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarActividades();
    this.cargarEmpleados();
  }

  cargarActividades(): void {
    this.loading = true;
    this.actividadesService.obtenerActividadesPorUsuario()
      .then(actividades => {
        this.actividades = actividades;
        this.filteredActividades = [...actividades]; // Inicializar las actividades filtradas
        this.loading = false;
      })
      .catch(error => {
        console.error('Error al cargar actividades:', error);
        this.mensaje = 'Error al cargar actividades.';
        this.loading = false;
      });
  }

  seleccionarActividad(actividad: any): void {
    this.actividadSeleccionada = { ...actividad };
  }

  editarActividad(): void {
    if (this.actividadSeleccionada) {
      this.loading = true;
      this.actividadesService.actualizarActividad(this.actividadSeleccionada._id, this.actividadSeleccionada)
        .then(() => {
          this.toastr.success('Exitoso!', 'Actividad actualizada con éxito!');
          this.cargarActividades(); // Usar cargarActividades en lugar de obtenerActividades
          this.actividadSeleccionada = null;
        })
        .catch(error => {
          console.error('Error al actualizar la actividad:', error);
          this.toastr.error('Error al actualizar la actividad.');
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  eliminarActividad(id: string): void {
    Swal.fire({
      title: "¿Estás seguro de que deseas eliminar esta actividad?",
      text: "¡No podrás revertir esta acción!", // Use "!" for stronger emphasis
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6", // Optional: Set button color
      cancelButtonColor: "#d33",    // Optional: Set button color
      confirmButtonText: "¡Sí, eliminarla!", // Use "!" for stronger emphasis
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.actividadesService.eliminarActividad(id)
          .then(() => {
            Swal.fire({
              title: "¡Eliminada!",
              text: "La actividad ha sido eliminada con éxito.",
              icon: "success"
            });
            this.cargarActividades(); // Use cargarActividades in success case
          })
          .catch(error => {
            console.error('Error al eliminar la actividad:', error);
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error al eliminar la actividad.",
              icon: "error"
            });
          })
          .finally(() => {
            this.loading = false;
          });
      }
    });
  }

  filtrarActividades(): void {
    this.filteredActividades = this.actividades.filter(actividad => {
      const cumpleStatus = !this.statusFilter || actividad.status === this.statusFilter;
      const cumpleEmpleado = !this.employeeNameFilter || 
        actividad.empleado.toLowerCase().includes(this.employeeNameFilter.toLowerCase());
      return cumpleStatus && cumpleEmpleado;
    });
  }

  cargarEmpleados(): void {
    this.actividadesService.obtenerEmpleados()
      .then(empleados => {
        this.empleados = empleados;
      })
      .catch(error => console.error("Error al cargar empleados:", error));
  }

  onClickLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }
}