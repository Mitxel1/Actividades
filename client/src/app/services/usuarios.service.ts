import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private httpClient = inject(HttpClient);
  private baseUrl: String;

  constructor() { 
    this.baseUrl = `http://localhost:3000/usuario`;
  }


  register(formValue: any){
      return firstValueFrom(
        this.httpClient.post<any>(`${this.baseUrl}/registro`,formValue)
      )
  }


  login(credentials: { nombre: string; password: string }) {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/login`, credentials)
    );
  }
  

isLogged(): boolean{
  return localStorage.getItem('token') ? true : false;
}

}
