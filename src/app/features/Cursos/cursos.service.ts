import { Injectable } from '@angular/core';
import { Cursos } from './curso.model';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private listaCursos: Cursos[] = [
    {
      idCurso: 1,
      comision: '123-MAÑANA',
      detalle: 'Lunes y Miércoles de 10:00 a 12:00',
      nombreCurso: 'ALED III',
      descripcion: 'Algoritmo y Estructura de Datos III',
      presencial: true,
      fechaInicio: new Date(2022, 11, 17),
      fechaFin: new Date(2023, 11, 17),
      profesor: {
        nombre: 'Felipe',
        apellido: 'Martinez',
        idProfesor: 1,
      },
    },

    {
      idCurso: 2,
      comision: '23-NOCTURNO',
      detalle: 'Lunes y Miércoles de 20:00 a 22:00',
      nombreCurso: 'ALED III',
      descripcion: 'Algoritmo y Estructura de Datos III',
      presencial: false,
      fechaInicio: new Date(2022, 11, 17),
      fechaFin: new Date(2022, 11, 17),
      profesor: {
        nombre: 'Juan',
        apellido: 'Perez',
        idProfesor: 1,
      },
    },
  ];

  private listaCursos$: BehaviorSubject<Cursos[]>;

  constructor() {
    this.listaCursos$ = new BehaviorSubject(this.listaCursos);
  }

  ObtenerCursosObservable(): Observable<Cursos[]> {
    // console.log("Profesores recuperados", this.listaProfesores$.asObservable());
    return this.listaCursos$.asObservable();
  }

  EliminarCurso(curso: Cursos) {
    let indice = this.listaCursos.indexOf(curso);
    this.listaCursos.splice(indice, 1);
    this.listaCursos$.next(this.listaCursos);
  }

  EditarCurso(curso: Cursos): Observable<Cursos> {
    const indice = this.listaCursos.findIndex(
      (id) => id.idCurso === curso.idCurso
    );
    if (indice !== -1) {
      this.listaCursos[indice] = curso;
      this.listaCursos$.next(this.listaCursos);
    }
    return of(); // Retorna un Observable vacío
  }

  AgregarCurso(nuevoCurso: Cursos) {
    this.listaCursos.push(nuevoCurso);
    this.listaCursos$.next(this.listaCursos);
    return of(); // Retorna un Observable vacío
  }
}
