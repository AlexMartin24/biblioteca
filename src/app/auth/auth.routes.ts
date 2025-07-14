import { Routes } from '@angular/router';
// import { LoginComponent } from './login/login.component';
import { RegistrarseComponent } from './registrarse/registrarse.component';
import { FormComponent } from './form/form.component';

export const AUTH_ROUTES: Routes = [
  // { path: 'iniciar-sesion', component: LoginComponent },

  // { path: 'registrarse', component: RegistrarseComponent },
  

  { path: 'registrarse/form', component: FormComponent },

  // {
  //   path: 'registrarse',
  //   component: RegistrarseComponent,
  //   children: [
  //     { path: 'form', component: FormComponent }
  //   ]
  // }
];
