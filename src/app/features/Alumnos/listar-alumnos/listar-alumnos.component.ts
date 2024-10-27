import { Component, ViewChild } from '@angular/core';
import { Alumno, NuevoAlumno } from '../alumno.model';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { DialogAlumnoComponent } from '../dialog-alumno/dialog-alumno.component';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { AlumnosService } from '../service/alumnos.service';
import { AuthService } from '../../../auth/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
  displayedColumns: string[] = [
    'Nombre',
    'Contacto',
    'InformacionAdicional',
    'Direccion',
    'Detalle',
    'Acciones',
  ];

  // MatTableDataSource maneja y administra los datos que se mostrarán en una tabla  Andegular Material
  dataSource = new MatTableDataSource<Alumno>();

  // @ViewChild(MatPaginator) permite acceder al componente MatPaginator en tu plantilla
  // paginator: variable que se usará para almacenar la referencia al MatPaginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private dialog: MatDialog,
    private alumnosService: AlumnosService,
    private authService: AuthService,

    private router: Router
  ) {}

  ngOnInit(): void {
    // this.obtenerAlumnos();
    this.obtenerAlumnosFirebase();
  }

  obtenerAlumnosFirebase() {
    this.authService.obtenerAlumnosFirebase().subscribe({
      next: (data) => {
        this.dataSource.data = data; // los datos recuperados, se guardan en dataSource
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      },
    });
  }

  EditarAlumno(alumno: Alumno) {
    // console.log('ID del alumno:', alumno.idAlumno); //  ID del alumno

    if (!alumno.idAlumno) {
      console.error('ID del alumno es indefinido');
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Error',
          message: 'No se puede editar un alumno sin un ID.',
          type: 'error',
        },
      });
      return; // Salir si el ID no es válido
    }

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
        nombre: '',
        apellido: '',
        correo: '',
        fechaNacimiento: '',
        telefono: '',
        direccion: '',
        idTipoUsuario: 1, // O el valor que corresponda
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Aquí usamos el tipo NuevoAlumno
        const nuevoAlumno: NuevoAlumno = {
          nombre: result.nombre,
          apellido: result.apellido,
          correo: result.correo,
          fechaNacimiento: result.fechaNacimiento,
          telefono: result.telefono,
          direccion: result.direccion,
          idTipoUsuario: 1,
          isDeleted: false,
          createdAt: new Date().toISOString(),
        };

        // Llama al servicio para agregar los datos del alumno
        this.authService
          .addUser(nuevoAlumno)
          .then(() => {
            console.log('Datos guardados correctamente');
          })
          .catch((error: any) => {
            console.error('Error guardando datos: ', error);
          });

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
    if (!alumno.idAlumno) {
      console.error('ID del alumno es indefinido');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de que deseas eliminar este alumno?',
        type: 'confirm',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.authService.deleteUser(alumno.idAlumno);
          console.log('Alumno eliminado correctamente');
          this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Éxito',
              message: 'El alumno ha sido eliminado correctamente.',
              type: 'info',
            },
          });
        } catch (error) {
          console.error('Error al eliminar el alumno:', error);
          this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Error',
              message:
                'No se pudo eliminar al alumno. Inténtalo de nuevo más tarde.',
              type: 'error',
            },
          });
        }
      } else {
        console.log('No se eliminaron datos');
        this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Cancelar',
            message: 'No se realizó la acción.',
            type: 'info',
          },
        });
      }
    });
  }

  detalleAlumno(idAlumno: number) {
    this.router.navigate(['/alumno/', idAlumno]);
  }
}
