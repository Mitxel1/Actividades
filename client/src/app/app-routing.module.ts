import { NgModule, createComponent } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { EmpleadoComponent } from './components/empleado/empleado.component';
import { CrearActividadComponent } from './components/crear-actividad/crear-actividad.component';
import { AuthGuard } from './auth.guard';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { UsuarioComponent } from './components/usuario/usuario.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'empleado', component: EmpleadoComponent, canActivate: [AuthGuard] },
  {path: 'crear-actividad', component:CrearActividadComponent, canActivate:[AuthGuard]},
  {path: 'calendario', component:CalendarioComponent, canActivate:[AuthGuard]},
  {path: 'usuario', component:UsuarioComponent, canActivate:[AuthGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
