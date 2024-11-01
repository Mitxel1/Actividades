import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActividadesService } from 'src/app/services/actividades.service';

@Component({
  selector: 'app-crear-actividad',
  templateUrl: './crear-actividad.component.html',
  styleUrls: ['./crear-actividad.component.css']
})
export class CrearActividadComponent implements OnInit {

  formulario: FormGroup;
  empleados: any[] = [];
  mensaje: string | null = null;

  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private actividadesService: ActividadesService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    // Inicializar el formulario con validación para la fecha de inicio
    this.formulario = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      assignedTo: ['', Validators.required],
      startDate: ['', [Validators.required, this.fechaValida()]], // Validación personalizada
      endDate: ['', Validators.required]
    },{ validator: this.fechaFinMayorQueInicio() });
  }

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.actividadesService.obtenerEmpleados()
      .then(empleados => {
        this.empleados = empleados;
      })
      .catch(error => {
        console.error('Error al cargar empleados:', error);
      });
  }

  fechaValida() {
    return (control: any) => {
      if (!control.value) {
        return null;  // Retorna null si no hay valor
      }
      
      const fechaSeleccionada = new Date(control.value);
      const hoy = new Date();
      
      // Convertir ambas fechas a formato YYYY-MM-DD para comparar solo las fechas sin tiempo
      const fechaSeleccionadaStr = fechaSeleccionada.toISOString().split('T')[0];
      const hoyStr = hoy.toISOString().split('T')[0];
      
      return fechaSeleccionadaStr >= hoyStr ? null : { fechaInvalida: true };
    };
  }

  // Validación para asegurar que la fecha de fin sea posterior a la de inicio
  fechaFinMayorQueInicio() {
    return (formGroup: FormGroup) => {
      const startDate = formGroup.get('startDate')?.value;
      const endDate = formGroup.get('endDate')?.value;

      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return { fechaFinInvalida: true };
      }
      return null;
    };
  }

  onSubmit() {
    if (this.formulario.invalid) {
      this.mensaje = 'Por favor, seleccione una fecha válida y complete todos los campos.';
      return;
    }

    const createdBy = localStorage.getItem('userId');
    const nuevaActividad = {
      title: this.formulario.value.title,
      description: this.formulario.value.description,
      createdBy: createdBy,
      assignedTo: this.formulario.value.assignedTo,
      startDate: this.formulario.value.startDate,
      endDate: this.formulario.value.endDate
    };

    this.actividadesService.crearActividad(nuevaActividad)
      .then(response => {
        this.toastr.success('¡Evento registrado exitosamente!');
        // Cargar notificaciones después de crear la actividad
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1000);
      })
      .catch(error => {
        this.mensaje = error.error?.error || 'Error al crear la actividad';
      });
  }

}

