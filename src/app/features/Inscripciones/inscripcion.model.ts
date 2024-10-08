import { Alumno } from "../Alumnos/alumno.model";
import { Cursos } from "../Cursos/curso.model";

export interface Inscripcion {
  idInscripcion: number;
  alumno: Alumno; // Referencia al alumno
  idCurso: number;
  fechaInscripcion: Date; // Fecha en que se inscribió
}
