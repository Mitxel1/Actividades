// src/app/services/reporte.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reporte } from '../interfaces/reporte.interface';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  
  private httpClient = inject(HttpClient);  // Inyecta HttpClient
  private apiUrl: string;

  constructor() {
    this.apiUrl = `http://localhost:3000/api`;  // Asegúrate de que esta URL coincida con la configuración de tu servidor
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  crearReporte(actividadId: string, data: any){
    return this.httpClient.post(`${this.apiUrl}/crear/${actividadId}`, data, {
      headers:this.getHeaders()
    });
  }

  obtenerReportesPorActividad(actividadId: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/actividad/${actividadId}`, {
      headers: this.getHeaders()
    });
  }

  obtenerReporte(reporteId: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/${reporteId}`, {
      headers: this.getHeaders()
    });
  }

  agregarComentarioAdmin(reporteId: string, comentario: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/${reporteId}/comentario`, 
      { contenido: comentario },
      { headers: this.getHeaders() }
    );
  }

  actualizarEstadoReporte(reporteId: string, estado: string): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/${reporteId}/estado`, 
      { estado },
      { headers: this.getHeaders() }
    );
  }
}
