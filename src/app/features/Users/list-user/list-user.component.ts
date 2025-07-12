import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';

// import { DialogAlumnoComponent } from '../dialog-alumno/dialog-alumno.component';
// import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';

import { User, NewUser } from '../model/user.model';
import { UserService } from '../service/user.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';


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
    // 'Acciones',
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
    console.log("agregar usuario");
  }

  editUser() {
    console.log("editar usuario");
  }

  deleteUser() {
    console.log("eliminar usuario");
  }


  // Función para mostrar usuarios activos o deshabilitados
  showStudentsTable() {
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
