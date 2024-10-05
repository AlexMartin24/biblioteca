import { Routes } from '@angular/router';
import { ListarProfesorComponent } from './features/Profesor/listar-profesor/listar-profesor.component';
import { PerfilProfesorComponent } from './features/Profesor/perfil-profesor/perfil-profesor.component';
import { ListarCursosComponent } from './features/Cursos/listar-cursos/listar-cursos.component';
import { ListarAlumnosComponent } from './features/Alumnos/listar-alumnos/listar-alumnos.component';
import { ListarAlumnoComponent } from './features/Alumnos/prueba/listar-alumno.component';
import { PerfilAlumnoComponent } from './features/Alumnos/perfil-alumno/perfil-alumno.component';

export const routes: Routes = [
     // { path: '', component: ListarAlumnoComponent },
     { path: '', component: ListarProfesorComponent },
     { path: 'profesores', component: ListarProfesorComponent },
     { path: 'profesor/:idProfesor', component: PerfilProfesorComponent },

     { path: 'prueba', component: ListarAlumnoComponent },


     { path: 'cursos', component: ListarCursosComponent },
     { path: 'alumnos', component: ListarAlumnosComponent },
     { path: 'alumno/:idAlumno', component: PerfilAlumnoComponent },


];
