import { Cursos } from "../Cursos/curso.model";

export interface Profesor {
  idProfesor: number;
  nombre: string;
  apellido: string;
  correo: string;
  fechaNacimiento: Date;
  telefono: string;
  // especialidad: string;
  estudios: Estudios[];
  estado: Estado[];
  cursos: Cursos[];
}

export interface Estudios {
  nombre: string;
  institucion: string;
  fechaObtencion: Date;
}

export interface Estado {
  idEstado: number;
  nombre: string;
}

export interface ProfesorResumen {
  idProfesor: number;
  nombre: string;
  apellido: string;
}

