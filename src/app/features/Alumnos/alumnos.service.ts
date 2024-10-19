import { Injectable } from '@angular/core';
import { Alumno } from './alumno.model';
import { BehaviorSubject, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  private listaAlumnos: Alumno[] = [
    {
      idAlumno: 1,
      nombre: 'Juan',
      apellido: 'Gonzalez',
      correo: 'juangonzalez@gmail.com',
      fechaNacimiento: new Date(1993, 11, 17),
      telefono: '1141123456',
      direccion: 'Calle Falsa 123',
      cursos: [
        {
          idCurso: 1,
          comision: '123-MAÑANA',
          detalle: 'Lunes y Miércoles de 10:00 a 12:00',
          nombreCurso: 'ALED III',
          descripcion: 'Algoritmo y Estructura de Datos III',
          presencial: true,
          fechaInicio: new Date(2022, 11, 17),
          fechaFin: new Date(2023, 11, 17),
          // profesor: {
          //   idProfesor: 1,
          //   nombre: 'Felipe',
          //   apellido: 'Martinez',
          // },
          idProfesor: 1,
          inscripciones: []
        },
      ],
      idTipoUsuario: 1
    },
  ];

  private listaAlumnos$: BehaviorSubject<Alumno[]>;

  constructor() {
    this.listaAlumnos$ = new BehaviorSubject(this.listaAlumnos);
  }

  ObtenerAlumnosObservable(): Observable<Alumno[]> {
    // console.log("Alumnos recuperados", this.listaAlumnos$.asObservable());
    return this.listaAlumnos$.asObservable();
  }

  ObtenerAlumnoPorId(id: number): Alumno | undefined {
    return this.listaAlumnos$.value.find((alumno) => alumno.idAlumno === id);
  }

  EliminarAlumno(alumno: Alumno) {
    let indice = this.listaAlumnos.indexOf(alumno);
    this.listaAlumnos.splice(indice, 1);
    this.listaAlumnos$.next(this.listaAlumnos);
  }

  EditarAlumno(alumno: Alumno): Observable<Alumno> {
    const indice = this.listaAlumnos.findIndex(
      (id) => id.idAlumno === alumno.idAlumno
    );
    if (indice !== -1) {
      this.listaAlumnos[indice] = alumno;
      this.listaAlumnos$.next(this.listaAlumnos);
    }
    return of(); // Retorna un Observable vacío
  }

  AgregarAlumno(nuevoCurso: Alumno) {
    this.listaAlumnos.push(nuevoCurso);
    this.listaAlumnos$.next(this.listaAlumnos);
    return of(); // Retorna un Observable vacío
  }
}
