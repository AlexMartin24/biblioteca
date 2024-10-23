import { Injectable } from '@angular/core';
import { Inscripcion } from './inscripcion.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {

  private listaInscripcion: Inscripcion[] = [
    {
      id: "1",
      idCurso: "2",
      idAlumno: '3',
      fecha: '12/12/2022'
    }

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


  // ObtenerAlumnosPorCurso(idCurso: number): Observable<Inscripcion[]> {
  //   const inscripcionesDelCurso = this.listaInscripcion.filter(inscripcion => inscripcion.idCurso === idCurso);
  //   // console.log("Alumnos inscriptos: ", inscripcionesDelCurso);
  //   return of(inscripcionesDelCurso); // Retorna las inscripciones filtradas
  // }



}
