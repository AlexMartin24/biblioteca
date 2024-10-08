import { Inscripcion } from '../Inscripciones/inscripcion.model';
import { ProfesorResumen } from '../Profesor/profesor.model';

export interface Cursos {
  idCurso: number;
  comision: string;
  nombreCurso: string;
  detalle: string;
  descripcion: string;
  presencial: boolean;
  fechaInicio: Date;
  fechaFin: Date;

  //  profesor: ProfesorResumen;

  idProfesor: number;
  inscripciones: Inscripcion[];

}
