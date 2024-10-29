import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  toastr = inject(ToastrService);
  private httpClient = inject(HttpClient);  // Inyecta HttpClient
  private baseUrl: string;
  private baseUr2: string;

  constructor() { 
    this.baseUrl = `http://localhost:3000/actividades`; // URL base para la API de actividades
    this.baseUr2 = `http://localhost:3000/usuario`
  }

  // Método para crear una actividad
  crearActividad(formValue: any) {
    const token =localStorage.getItem('token')
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}`, formValue,{
        headers: {Authorization: `Bearer ${token}`}
      })
    );
  }

  obtenerEmpleados() {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUr2}/usuarios`) // URL para empleados
    );
  }

  // Método para obtener las actividades creadas por el usuario
  obtenerActividadesPorUsuario() {
    const token = localStorage.getItem('token');
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}`, {
        headers: { Authorization: `Bearer ${token}` } // Agrega el token en el header
      })
    );
  }

  actualizarEstatusActividad(id: string, data: any) {
    const token = localStorage.getItem('token');
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
    );
  }
  


  // Método para actualizar una actividad
  actualizarActividad(id: string, formValue: any) {
    const token = localStorage.getItem('token');
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/${id}`, formValue, {
        headers: { Authorization: `Bearer ${token}` }
      })
    );
  }

  // Método para eliminar una actividad
  eliminarActividad(id: string) {
    const token = localStorage.getItem('token');
    return firstValueFrom(
      this.httpClient.delete<any>(`${this.baseUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    );
  }

  // Método para obtener actividades filtradas
  filtrarActividades(status?: string, employeeName?: string) {
    const token = localStorage.getItem('token');
    const params: any = {}; // Objeto para parámetros de búsqueda

    if (status) params.status = status;
    if (employeeName) params.employeeName = employeeName;

    return this.httpClient.get<any[]>(`${this.baseUrl}/filtrar`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    }).toPromise();
  };


  obtenerUsuarioActual() {
    const token = localStorage.getItem('token');
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUr2}/actual`, {
        headers: { Authorization: `Bearer ${token}` } // Agrega el token en el header
      })
    );
  }


  // Método para iniciar una actividad
  async iniciarActividad(id: string) {
    const token = localStorage.getItem('token');
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/iniciar-actividad/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    );
  }

  // Método para completar una actividad
  completarActividad(id: string) {
    const token = localStorage.getItem('token');
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/completar-actividad/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    );
  }

}



