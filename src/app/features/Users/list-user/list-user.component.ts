import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';

// import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';

import { User, NewUser } from '../model/user.model';
import { UserService } from '../service/user.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.css'
})
export class ListUserComponent {

  users$!: User[];
  displayedColumns: string[] = [
    'Name',
    'Contact',
    'AdditionalInformation',
    'Address',
    // 'Detalle',
    'Actions',
  ];

  // DataSource de los users
  dataSource = new MatTableDataSource<User>();

  // Control para mostrar tabla de eliminados
  showDisabledTable: boolean = false;

  // @ViewChild(MatPaginator) permite acceder al componente MatPaginator en tu plantilla
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private dialog: MatDialog,
    private usersService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getEnabledUsers();
  }

  getEnabledUsers() {
    this.usersService.getUsersByStatus(true).subscribe({
      next: (enabledUsers) => {
        this.dataSource.data = enabledUsers;
        console.log('Usuarios habilitados:', enabledUsers);
      },
      error: (error) => {
        console.error('Error al obtener usuarios habilitados:', error);
      }
    });
  }

  getDisabledUsers() {
    this.usersService.getUsersByStatus(false).subscribe({
      next: (disabledUsers) => {
        this.dataSource.data = disabledUsers;
        console.log('Usuarios deshabilitados:', disabledUsers);
      },
      error: (error) => {
        console.error('Error al obtener usuarios deshabilitados:', error);
      }
    });
  }

  addUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: {
        name: '',
        lastname: '',
        email: '',
        birthdate: '',
        phone: '',
        address: '',
        schooldId: "",
        role: "",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newUser: NewUser = {
          name: result.name,
          lastname: result.lastname,
          email: result.email,
          birthdate: result.birthdate,
          phone: result.phone,
          address: result.address,
          schooldId: result.schooldId,
          role: result.role,
          enabled: true,
          createdAt: new Date().toISOString(),
        };

        // Llama al servicio para agregar el usuario
        this.usersService.addUser(newUser)
          .then(() => {
            // Solo se muestra el diálogo de éxito si la operación fue exitosa
            this.dialog.open(ConfirmDialogComponent, {
              data: {
                title: 'Éxito',
                message: 'El user ha sido agregado correctamente.',
                type: 'info',
              },
            });
          })
          .catch((error: Error) => {
            // Captura y muestra el error
            console.error('Error guardando datos: ', error.message);
            this.dialog.open(ConfirmDialogComponent, {
              data: {
                title: 'Error',
                message: error.message,
                type: 'error',
              },
            });
          });
      }
    });
  }



  editUser(user: User) {
    // console.log('ID del usuario:', user.userId); //  ID del user

    if (!user.userId) {
      console.error('El ID del usuario es indefinido');
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Error',
          message: 'No se puede editar un user sin un ID.',
          type: 'error',
        },
      });
      return; // Salir si el ID no es válido
    }

    const dialogRef = this.dialog.open(UserDialogComponent, {
      disableClose: true,
      data: user,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const editUser: Partial<User> = {
          name: result.name,
          lastname: result.lastname,
          email: result.email,
          birthdate: result.birthdate,
          phone: result.phone,
          address: result.address,
          schooldId: result.schooldId,
          role: result.role,
        };

        try {
          await this.usersService.updateUserData(
            user.userId,
            editUser
          );
          console.log('User editado correctamente', result);
          this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Éxito',
              message: 'Datos editados correctamente.',
              type: 'info',
            },
          });
        } catch (error) {
          console.error('Error al editar el user:', error);
          this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Error',
              message: 'No se pudo editar los datos del user.',
              type: 'error',
            },
          });
        }
      }
    });
  }



  deleteUser(user: User) {
    if (!user.userId) {
      console.error('ID del user es indefinido');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de que deseas eliminar este user?',
        type: 'confirm',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.usersService.deleteUser(user.userId);
          console.log('User eliminado correctamente');
          this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Éxito',
              message: 'El usuario ha sido eliminado correctamente.',
              type: 'info',
            },
          });
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
          this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Error',
              message:
                'No se pudo eliminar al usuario. Inténtalo de nuevo más tarde.',
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

  // Función para mostrar usuarios activos o deshabilitados
  showUsersTable() {
    if (this.showDisabledTable) {
      // Si la tabla de deshabilitados ya está activa, mostramos los usuarios activos
      this.getEnabledUsers(); // Cargar usuarios activos
    } else {
      // Sino está activa, muestra los usuarios deshabilitados
      this.getDisabledUsers(); // Cargar usuarios deshabilitados
    }
    // Cambiar el valor de showDisabledTable para alternar entre activos y deshabilitados
    this.showDisabledTable = !this.showDisabledTable;
  }


}
