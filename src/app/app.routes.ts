import { Routes } from '@angular/router';
import { ListarProfesorComponent } from './features/Profesor/listar-profesor/listar-profesor.component';
import { PerfilProfesorComponent } from './features/Profesor/perfil-profesor/perfil-profesor.component';
import { ListarCursosComponent } from './features/Cursos/listar-cursos/listar-cursos.component';
import { ListarAlumnosComponent } from './features/Alumnos/listar-alumnos/listar-alumnos.component';
import { ListarAlumnoComponent } from './features/Alumnos/prueba/listar-alumno.component';
import { PerfilAlumnoComponent } from './features/Alumnos/perfil-alumno/perfil-alumno.component';
import { CursoComponent } from './features/Cursos/curso/curso.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  // { path: '', component: ListarAlumnoComponent },
  //   { path: '', component: ListarProfesorComponent },
  { path: 'profesores', component: ListarProfesorComponent },
  { path: 'profesor/:idProfesor', component: PerfilProfesorComponent },

  { path: 'prueba', component: ListarAlumnoComponent },

  { path: 'cursos', component: ListarCursosComponent },
  { path: 'curso/:idCurso', component: CursoComponent },

  { path: 'alumnos', component: ListarAlumnosComponent },
  { path: 'alumno/:idAlumno', component: PerfilAlumnoComponent },

  { path: '', component: LoginComponent },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  
];
