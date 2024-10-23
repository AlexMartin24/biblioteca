import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursosService } from '../cursos.service';
import { Cursos } from '../curso.model';
import { SharedModule } from '../../../shared/shared.module';
import { Inscripcion } from '../../Inscripciones/inscripcion.model';
import { Profesor } from '../../Profesor/profesor.model';
import { ProfesorService } from '../../Profesor/services/profesor.service';
import { MatDividerModule } from '@angular/material/divider';
import { Alumno } from '../../Alumnos/alumno.model';
import { InscripcionService } from '../../Inscripciones/inscripcion.service';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [SharedModule, MatDividerModule],
  templateUrl: './curso.component.html',
  styleUrl: './curso.component.css'
})
export class CursoComponent {

  curso$: Cursos | undefined;
  listaInscripcion$: Inscripcion[] = [];
  idCurso!: string | null; // almacenar el ID en string ya que viene como parametro
  profesor$: Profesor | undefined;


  constructor(
    private cursoService: CursosService,
    private inscripcionService: InscripcionService,
    private profesorService: ProfesorService,
    private route: ActivatedRoute, // ActivatedRoute se usa Para acceder a los parámetros de la ruta
    private router: Router,
  ) { }

  ngOnInit(): void {
    // this.ObtenerTodasLasInscripciones();
    // Recupera el idCurso de la cadena desde la URL
    this.route.paramMap.subscribe((params) => {
      this.idCurso = params.get('idCurso'); // Asignamos el valor a la variable idCurso. params.get() siempre devuelve un string (o null) ya que proviene de la URL
      if (this.idCurso) {
        // console.log('---- EXISTE ID DEL CURSO - ---');
        // +this.idCurso convierte el string a un número y llamamos a obtenerCurso
        this.ObtenerCursoPorId(+this.idCurso);
        // this.ObtenerAlumnosPorCurso(+this.idCurso);
      } else {
        // console.log('---- NO SE ENCONTRÓ ID DEL CURSO - ---');
      }
    });
  }

  //recupera datos del curso 
  ObtenerCursoPorId(idCurso: number): void {
    this.curso$ = this.cursoService.ObtenerCursoPorId(idCurso);
    if (this.curso$) {
      this.profesor$ = this.profesorService.ObtenerProfesorPorId(this.curso$.idProfesor);
      // console.log("Curso: ", this.curso$);
      // console.log("Profesor recuperado: ", this.profesor$);
    }
  }



  // ObtenerAlumnosPorCurso(idCurso: number) {
  //   this.inscripcionService.ObtenerAlumnosPorCurso(idCurso).subscribe((inscripciones: Inscripcion[]) => {
  //     this.listaInscripcion$ = inscripciones; // Asigna la lista de inscripciones
  //     console.log(this.listaInscripcion$);
  //   });
  // }

  detalleAlumno(idAlumno: number) {
    this.router.navigate(['/alumno/', idAlumno]);
  }




}
