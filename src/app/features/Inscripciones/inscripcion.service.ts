import { Injectable } from '@angular/core';
import { Inscripcion } from './inscripcion.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {

  private listaInscripcion: Inscripcion[] = [
    {
      idInscripcion: 1,
      alumno: {
        idAlumno: 1,
        nombre: "Juan",
        apellido: "Perez",
        correo: "asd@asd.com",
        fechaNacimiento: new Date(1990, 5, 25),
        telefono: "",
        direccion: "",
        cursos: [] // Puedes dejarlo vacío o incluir IDs de cursos
      },
      idCurso: 1, // Solo almacenas el ID del curso
      fechaInscripcion: new Date(2024, 5, 25)
    },

  ];



  constructor() { }

  //metodo para obtener todas las inscripciones
  // ObtenerTodasLasInscripciones(): Observable<Inscripcion[]> {
  //   return of(this.listaInscripcion); // Retorna un Observable con la lista de inscripciones
  // }

  // ObtenerTodasLasInscripciones() {
  //   this.inscripcionService.ObtenerTodasLasInscripciones().subscribe((inscripciones: Inscripcion[]) => {
  //     this.listaInscripcion$ = inscripciones; // Asigna la lista de inscripciones
  //     console.log(this.listaInscripcion$);
  //   });
  // }


  ObtenerAlumnosPorCurso(idCurso: number): Observable<Inscripcion[]> {
    const inscripcionesDelCurso = this.listaInscripcion.filter(inscripcion => inscripcion.idCurso === idCurso);
    // console.log("Alumnos inscriptos: ", inscripcionesDelCurso);
    return of(inscripcionesDelCurso); // Retorna las inscripciones filtradas
  }



}
