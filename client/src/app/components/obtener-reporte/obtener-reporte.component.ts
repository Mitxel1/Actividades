import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReporteService } from 'src/app/services/reporte.service';

@Component({
  selector: 'app-obtener-reporte',
  templateUrl: './obtener-reporte.component.html',
  styleUrls: ['./obtener-reporte.component.css']
})
export class ObtenerReporteComponent {

  reportes: any[] = [];
  actividadId: string;
  loading = false;

  constructor(
    private reporteService: ReporteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.actividadId = this.route.snapshot.params['actividadId'];
  }

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.loading = true;
    this.reporteService.obtenerReportesPorActividad(this.actividadId)
      .subscribe(
        response => {
          this.reportes = response.data;
          this.loading = false;
        },
        error => {
          console.error('Error al cargar reportes:', error);
          this.loading = false;
        }
      );
  }

  irARevision(reporteId: string): void {
    this.router.navigate(['/reporte', reporteId, 'comentario']);
  }
}
