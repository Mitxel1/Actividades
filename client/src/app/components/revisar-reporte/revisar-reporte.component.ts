import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-revisar-reporte',
  templateUrl: './revisar-reporte.component.html',
  styleUrls: ['./revisar-reporte.component.css']
})
export class RevisarReporteComponent {
  reporte: any = null;
  comentarioForm: FormGroup;
  loading = false;
  submitting = false;
  reporteId: string;

  constructor(
    private fb: FormBuilder,
    private reporteService: ReporteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.reporteId = this.route.snapshot.params['reporteId'];
    this.comentarioForm = this.fb.group({
      contenido: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarReporte();
  }

  cargarReporte(): void {
    this.loading = true;
    this.reporteService.obtenerReporte(this.reporteId)
      .subscribe(
        response => {
          this.reporte = response.data;
          this.loading = false;
        },
        error => {
          console.error('Error al cargar el reporte:', error);
          this.loading = false;
        }
      );
  }

  async onSubmit(): Promise<void> {
    if (this.comentarioForm.invalid) return;

    this.submitting = true;
    try {
      await this.reporteService.agregarComentarioAdmin(
        this.reporteId,
        this.comentarioForm.get('contenido')?.value
      ).toPromise();

      this.comentarioForm.reset();
      
      console.log('Reporte:', this.reporte); // Verificar el objeto reporte completo
      console.log('ID de actividad:', this.reporte?.actividad); // Verificar específicamente el ID de actividad
      
      if (this.reporte && this.reporte.actividad) {
        const actividadId = typeof this.reporte.actividad === 'object' ? this.reporte.actividad._id : this.reporte.actividad;
      
        if (actividadId) {
          console.log('Intentando navegar a:', '/reporte/actividad/' + actividadId);
          this.router.navigate(['/reporte/actividad', actividadId])
            .then(() => console.log('Navegación exitosa'))
            .catch(error => console.error('Error en navegación:', error));
        } else {
          console.error('El ID de la actividad no está disponible');
        }
      } else {
        console.error('No se pudo obtener la actividad del reporte');
      }
      
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    } finally {
      this.submitting = false;
    }
}
}
