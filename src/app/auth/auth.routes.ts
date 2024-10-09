import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrarseComponent } from './registrarse/registrarse.component';

export const AUTH_ROUTES: Routes = [
  { path: 'registrarse', component: RegistrarseComponent },
  
  { path: 'iniciar-sesion', component: LoginComponent },
];
