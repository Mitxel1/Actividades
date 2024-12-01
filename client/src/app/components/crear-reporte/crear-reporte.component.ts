// src/app/components/crear-reporte/crear-reporte.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-crear-reporte',
  templateUrl: './crear-reporte.component.html',
  styleUrls: ['./crear-reporte.component.css']
})
export class CrearReporteComponent implements OnInit {
  reporteForm!: FormGroup;
  archivosSeleccionados: File[] = [];
  submitting = false;
  actividadId: string;
  reportes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private reporteService: ReporteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.actividadId = this.route.snapshot.params['actividadId'];
  }

  ngOnInit(): void {
    this.initForm();
    this.cargarReportes();
  }

  private initForm(): void {
    this.reporteForm = this.fb.group({
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      recursos: this.fb.array([]),
      problemas: this.fb.array([]),
      soluciones: this.fb.array([])
    });
  }

  // Métodos para manejar FormArrays
  get recursos(): FormArray {
    return this.reporteForm.get('recursos') as FormArray;
  }

  get problemas(): FormArray {
    return this.reporteForm.get('problemas') as FormArray;
  }

  get soluciones(): FormArray {
    return this.reporteForm.get('soluciones') as FormArray;
  }

  agregarCampo(arrayName: string): void {
    const array = this.reporteForm.get(arrayName) as FormArray;
    array.push(this.fb.control(''));
  }

  removerCampo(arrayName: string, index: number): void {
    const array = this.reporteForm.get(arrayName) as FormArray;
    array.removeAt(index);
  }

  async onSubmit(): Promise<void> {
    if (this.reporteForm.invalid) return;

    this.submitting = true;

    // Agregar datos del formulario
    const reporteData = {
      titulo: this.reporteForm.get('titulo')?.value,
      contenido: this.reporteForm.get('contenido')?.value,
      recursos: this.recursos.value,
      problemas: this.problemas.value,
      soluciones: this.soluciones.value
    };

    try {
      await this.reporteService.crearReporte(this.actividadId, reporteData).toPromise();
      this.router.navigate(['/empleado']);
    } catch (error) {
      console.error('Error al crear reporte:', error);
    } finally {
      this.submitting = false;
    }
  }


  //Obtener Reportes
  cargarReportes(): void {
    this.reporteService.obtenerReportesPorActividad(this.actividadId).subscribe({
      next: (data) => {
        this.reportes = data.data; // Asegúrate de que el objeto de respuesta tenga la estructura esperada
      },
      error: (error) => {
        console.error('Error al obtener reportes:', error);
      }
    });
  }

  //Cerra Sesion
  onClickLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}