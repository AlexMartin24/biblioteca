import { Injectable } from '@angular/core';
import { Estado, Profesor } from './profesor.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProfesorService {
  private listaProfesores: Profesor[] = [
    {
      idProfesor: 1,
      nombre: 'Felipe',
      apellido: 'Martinez',
      correo: 'felipemartinez@gmail.com',
      fechaNacimiento: new Date(2022, 11, 17),
      telefono: '1123456789',
      //especialidad: 'Angular',
      estado: [
        {
          idEstado: 1,
          nombre: 'Habilitado',
        },
      ],
      estudios: [
        {
          nombre: 'Licenciatura en Informática',
          institucion: 'Universidad A',
          fechaObtencion: new Date(2015, 6, 1),
        },
        {
          nombre: 'Máster en Desarrollo Web',
          institucion: 'Universidad B',
          fechaObtencion: new Date(2018, 6, 1),
        },
      ],
      cursos: [
        {
          idCurso: 1,
          comision: '123-MAÑANA',
          detalle: 'Lunes y Miércoles de 10:00 a 12:00',
          nombreCurso: 'ALED III',
          descripcion: 'Algoritmo y Estructura de Datos III',
          presencial: true,
          fechaInicio: new Date(1990, 5, 25),
          fechaFin: new Date(1990, 5, 25),
          profesor: {
            idProfesor: 1,
            nombre: 'Felipe',
            apellido: 'Martinez',
          },
        },
      ],
    },
    {
      idProfesor: 2,
      nombre: 'Ana',
      apellido: 'Gomez',
      correo: 'anagomez@gmail.com',
      fechaNacimiento: new Date(1990, 5, 25),
      telefono: '2234567890',
      //especialidad: 'React',
      estado: [
        {
          idEstado: 1,
          nombre: 'Habilitado',
        },
      ],
      estudios: [
        {
          nombre: 'Ingeniería en Sistemas',
          institucion: 'Universidad C',
          fechaObtencion: new Date(2012, 6, 1),
        },
      ],
      cursos: [],
    },
    {
      idProfesor: 3,
      nombre: 'Carlos',
      apellido: 'Fernandez',
      correo: 'carlosfernandez@gmail.com',
      fechaNacimiento: new Date(1985, 2, 10), // 10 de marzo de 1985
      telefono: '3345678901',
      //especialidad: 'Vue.js',
      estado: [
        {
          idEstado: 1,
          nombre: 'Habilitado',
        },
      ],
      estudios: [],
      cursos: [],
    },
    {
      idProfesor: 4,
      nombre: 'Lucia',
      apellido: 'Hernandez',
      correo: 'luciahernandez@gmail.com',
      fechaNacimiento: new Date(1995, 8, 30), // 30 de septiembre de 1995
      telefono: '4456789012',
      //especialidad: 'Node.js',
      estado: [
        {
          idEstado: 2,
          nombre: 'Deshabilitado',
        },
      ],
      estudios: [],
      cursos: [],
    },
  ];

  private listaEstados: Estado[] = [
    {
      idEstado: 1,
      nombre: 'Habilitado',
    },
    {
      idEstado: 2,
      nombre: 'Desabilitado',
    },
  ];

  //manejar el estado de la lista de objetos de tipo Profesor
  //BehaviorSubject facilita la comunicación y sincronización de datos entre diferentes partes de la aplicación.
  private listaProfesores$: BehaviorSubject<Profesor[]>;

  constructor() {
    this.listaProfesores$ = new BehaviorSubject(this.listaProfesores);
  }

  ObtenerProfesorPorId(id: number): Profesor | undefined {
    return this.listaProfesores$.value.find(
      (profesor) => profesor.idProfesor === id
    );
  }

  ObtenerProfesoresObservable(): Observable<Profesor[]> {
    // console.log("Profesores recuperados", this.listaProfesores$.asObservable());
    return this.listaProfesores$.asObservable();
  }

  EditarProfesor(profesor: Profesor): Observable<Profesor> {
    const indice = this.listaProfesores.findIndex(
      (id) => id.idProfesor === profesor.idProfesor
    );
    if (indice !== -1) {
      this.listaProfesores[indice] = profesor;
      this.listaProfesores$.next(this.listaProfesores);
    }
    return of(); // Retorna un Observable vacío
  }

  EliminarProfe(profesor: Profesor) {
    let indice = this.listaProfesores.indexOf(profesor);
    this.listaProfesores.splice(indice, 1);
    this.listaProfesores$.next(this.listaProfesores);
  }

  AgregarProfesor(profesor: Profesor): Observable<Profesor> {
    this.listaProfesores.push(profesor);
    this.listaProfesores$.next(this.listaProfesores);
    return of(); // Retorna un Observable vacío
  }

  // Método para obtener todos los estados posibles
  ObtenerEstadosPosibles(): Estado[] {
    return this.listaEstados;
  }
}
