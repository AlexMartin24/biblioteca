import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Cursos } from './features/Cursos/curso.model';
import { CursosService } from './features/Cursos/cursos.service';
import { Profesor } from './features/Profesor/profesor.model';
import { ProfesorService } from './features/Profesor/services/profesor.service';

@Injectable({
  providedIn: 'root'
})
export class ProfesorCursoService {

  constructor(
    private cursosService: CursosService,
    private profesorService: ProfesorService
  ) { }


  //en esta funcion recupero a traves del id los datos de cursos y profesor
  // para no estar recuperando constantemente ambos datos. esta en un service diferente porque si tenemos un bdd se borra
  obtenerCursosConProfesores(): Observable<{ curso: Cursos; profesor: Profesor | undefined }[]> {
    // Obtiene un observable que emite la lista de cursos desde el servicio de cursos
    return this.cursosService.ObtenerCursosObservable().pipe(
      // Utiliza el operador 'map' para transformar la lista de cursos
      map(cursos => {
        // Mapea cada curso a un nuevo objeto que contiene el curso y el profesor
        return cursos.map(curso => {
          // Obtiene el profesor correspondiente al idProfesor del curso
          const profesor = this.profesorService.ObtenerProfesorPorId(curso.idProfesor);
          // Retorna un objeto que contiene el curso y el profesor encontrado (o undefined)
          return { curso, profesor };
        });
      })
    );
  }

}
