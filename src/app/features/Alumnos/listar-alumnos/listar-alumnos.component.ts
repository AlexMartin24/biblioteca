import { Component } from '@angular/core';
import { Alumno } from '../alumno.model';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { DialogAlumnoComponent } from '../dialog-alumno/dialog-alumno.component';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { AlumnosService } from '../service/alumnos.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-listar-alumnos',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './listar-alumnos.component.html',
  styleUrl: './listar-alumnos.component.css',
})
export class ListarAlumnosComponent {
  // alumnos$!: Observable<Alumno[]>;
  alumnos$!: Alumno[];


  constructor(
    private dialog: MatDialog,
    private alumnosService: AlumnosService,
    private authService: AuthService,

    private router: Router,
  ) { }

  ngOnInit(): void {
    // this.obtenerAlumnos();
    this.obtenerAlumnosFirebase();
  }

  async obtenerAlumnosFirebase() {
    try {
      this.alumnos$ = await this.authService.getUsers();
      console.log(this.alumnos$);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  }




  // obtenerAlumnos() {
  //   this.alumnos$ = this.alumnosService.ObtenerAlumnosObservable();
  //   console.log(this.alumnos$);
  // }

  // obtenerAlumno() {
  //   alert('Info del alumno');
  // }

  EditarAlumno(alumno: Alumno) {
    // console.log('ID del alumno:', alumno.idAlumno); // Comprobar el ID del alumno

    // if (!alumno.idAlumno) {
    //     console.error('ID del alumno es indefinido');
    //     this.dialog.open(ConfirmDialogComponent, {
    //         data: {
    //             title: 'Error',
    //             message: 'No se puede editar un alumno sin un ID.',
    //             type: 'error',
    //         },
    //     });
    //     return; // Salir si el ID no es válido
    // }

    const dialogRef = this.dialog.open(DialogAlumnoComponent, {
      data: alumno,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const editarAlumno: Partial<Alumno> = {
          nombre: result.nombre,
          apellido: result.apellido,
          correo: result.correo,
          fechaNacimiento: result.fechaNacimiento,
          telefono: result.telefono,
          direccion: result.direccion,
        };

        try {
          await this.authService.updateUserData(alumno.idAlumno, editarAlumno);
          console.log('Alumno editado correctamente', result);
          this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Éxito',
              message: 'Datos editados correctamente.',
              type: 'info',
            },
          });
        } catch (error) {
          console.error('Error al editar el alumno:', error);
          this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Error',
              message: 'No se pudo editar los datos del alumno.',
              type: 'error',
            },
          });
        }
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
          idAlumno: "12",
          nombre: result.nombre,
          apellido: result.apellido,
          correo: result.correo,
          fechaNacimiento: new Date(),
          telefono: result.telefono,
          direccion: result.direccion,
          // cursos: result.cursos,
          idTipoUsuario: 1
        };

        // Llama al servicio para editar el alumno
        this.alumnosService.AgregarAlumno(nuevoAlumno);
        console.log('Alumno Agregado correctamente', result);
        this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Éxito',
            message: 'El alumno ha sido agregado correctamente.',
            type: 'info',
          },
        });

      }
    });
  }

  EliminarAlumno(alumno: Alumno) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de que deseas eliminar este alumno?',
        type: 'confirm',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.alumnosService.EliminarAlumno(alumno);
        console.log('Alumno eliminado correctamente');

        this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Éxito',
            message: 'El alumno ha sido eliminado correctamente.',
            type: 'info',
          },
        });
      };
    });
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
