import { Component } from '@angular/core';
import { Alumno } from '../alumno.model';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AlumnosService } from '../alumnos.service';
import { SharedModule } from '../../../shared/shared.module';
import { DialogAlumnoComponent } from '../dialog-alumno/dialog-alumno.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-alumnos',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './listar-alumnos.component.html',
  styleUrl: './listar-alumnos.component.css',
})
export class ListarAlumnosComponent {
  alumnos$!: Observable<Alumno[]>;

  constructor(
    private dialog: MatDialog,
    private alumnosService: AlumnosService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.obtenerAlumnos();
  }

  obtenerAlumnos(){
    this.alumnos$ = this.alumnosService.ObtenerAlumnosObservable();
    console.log(this.alumnos$);
  }

  // obtenerAlumno() {
  //   alert('Info del alumno');
  // }

  EditarAlumno(alumno: Alumno) {
    const dialogRef = this.dialog.open(DialogAlumnoComponent, {
      data: alumno,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const editarAlumno: Alumno = {
          idAlumno: alumno.idAlumno,
          nombre: result.nombre,
          apellido: result.apellido,
          correo: result.correo,
          fechaNacimiento: result.fechaNacimiento,
          telefono: result.telefono,
          direccion: result.direccion,
          cursos: result.cursos,
        };

        // Llama al servicio para editar el alumno
        this.alumnosService.EditarAlumno(editarAlumno);
        console.log('alumno editado correctamente', result);
      }
    });
  }

  AgregarAlumno() {
    const dialogRef = this.dialog.open(DialogAlumnoComponent, {
      data: {
        idAlumno: 1,
        nombre: '',
        apellido: '',
        correo: '',
        fechaNacimiento: '',
        telefono: '',
        direccion: '',
        curso: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const nuevoAlumno: Alumno = {
          idAlumno: obtenerSiguienteNumero(),
          nombre: result.nombre,
          apellido: result.apellido,
          correo: result.correo,
          fechaNacimiento: new Date(),
          telefono: result.telefono,
          direccion: result.direccion,
          cursos: result.cursos,
        };

        // Llama al servicio para editar el curso
        this.alumnosService.AgregarAlumno(nuevoAlumno);
        console.log('Alumno editado correctamente', result);
      }
    });
  }

  EliminarAlumno(curso: Alumno) {
    this.alumnosService.EliminarAlumno(curso);
  }

  //Angular utiliza un identificador para determinar qué elementos han cambiado y así minimizar el número de actualizaciones necesarias en el DOM.
  trackByAlumnosId(index: number, alumno: Alumno) {
    return alumno.idAlumno;
  } 

  detalleAlumno(idAlumno: number) {
    this.router.navigate(['/alumno/', idAlumno]);
  }



}

let ultimoNumero = 10; // Empieza antes del rango deseado
function obtenerSiguienteNumero() {
  ultimoNumero++;
  console.log(ultimoNumero);
  return ultimoNumero;
}
