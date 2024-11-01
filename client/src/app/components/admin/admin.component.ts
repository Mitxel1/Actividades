import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadesService } from 'src/app/services/actividades.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';

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
    if (confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
      this.loading = true;
      this.actividadesService.eliminarActividad(id)
        .then(() => {
          this.toastr.success('Exitoso!', 'Actividad eliminada con éxito!');
          this.cargarActividades(); // Usar cargarActividades en lugar de obtenerActividades
        })
        .catch(error => {
          console.error('Error al eliminar la actividad:', error);
          this.toastr.error('Error al eliminar la actividad.');
        })
        .finally(() => {
          this.loading = false;
        });
    }
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