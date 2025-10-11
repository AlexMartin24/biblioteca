import { Component, ViewChild } from '@angular/core';
import { NewSchool, School } from '../model/school.model';
import { DialogService } from '../../../core/services/dialog.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SchoolService } from '../services/school.service';
import { SchoolDialogService } from '../services/school-dialog.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-list-schools',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './list-schools.component.html',
  styleUrl: './list-schools.component.css',
})
export class ListSchoolsComponent {
  school$!: School[];
  displayedColumns: string[] = [
    'Name',
    'CUE',
    'Province',
    'Locality',
    'Address',
    // 'CreatedAt',
    'Actions',
  ];

  // DataSource de los schools
  dataSource = new MatTableDataSource<School>();

  // Control para mostrar tabla de eliminados
  showDisabledTable: boolean = false;

  // @ViewChild(MatPaginator) permite acceder al componente MatPaginator en tu plantilla
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private dialog: MatDialog,
    private schoolService: SchoolService,
    private dialogService: DialogService,
    private schoolDialogService: SchoolDialogService,
  ) {}

  ngOnInit(): void {
    this.getEnabledSchools();
  }

  getEnabledSchools() {
    this.schoolService.getSchoolsByStatus(true).subscribe({
      next: (enabledSchools) => {
        this.dataSource.data = enabledSchools;
        console.log('Recursos habilitados:', enabledSchools);
      },
      error: (error) => {
        console.error('Error al obtener recursos habilitados:', error);
      },
    });
  }

  getDisabledSchools() {
    this.schoolService.getSchoolsByStatus(false).subscribe({
      next: (disabledSchools) => {
        this.dataSource.data = disabledSchools;
        console.log('Escuelas deshabilitadas:', disabledSchools);
      },
      error: (error) => {
        console.error('Error al obtener escuelas deshabilitadas:', error);
      },
    });
  }

  addSchool() {
    console.log('Agregar escuela');
    this.schoolDialogService
      .openSchoolDialog({ mode: 'create' })
      .subscribe((result) => {
        if (result) {
          const newSchool: NewSchool = {
            name: result.name,
            cue: result.cue,
            province: result.province,
            locality: result.locality,
            address: result.address,
            contact: result.contact,
            phone: result.phone,
            email: result.email,
            description: result.description,

            createdAt: new Date().toISOString(),
            enabled: true,
          };
          this.schoolService.addSchool(newSchool);
        }
      });
  }


  editSchool(school: School) {
    if (!school.schoolId) {
      this.dialogService.errorDialog(
        'Error',
        'No se puede editar un recurso sin ID.'
      );
      return;
    }

    this.schoolDialogService
      .openSchoolDialog({ mode: 'edit', data: school })
      .subscribe(async (result) => {
        if (result) {
          try {
            await this.schoolService.updateSchoolData(
              school.schoolId,
              result
            );
            this.dialogService.infoDialog(
              'Éxito',
              'Datos editados correctamente.'
            );
          } catch (error) {
            this.dialogService.errorDialog(
              'Error',
              'No se pudo editar los datos del recurso.'
            );
          }
        }
      });
  }

  deleteSchool(school: School) {
    if (!school.schoolId) {
      console.error('ID de la escuela es indefinido');
      return;
    }
    this.dialogService
      .confirmDialog({
        title: 'Confirmar Eliminación Permanente',
        message:
          '¿Estás seguro de que deseas eliminar este recurso de forma permanente? Esta acción no se puede deshacer.',
        type: 'confirm',
      })
      .subscribe(async (result) => {
        if (result) {
          await this.schoolService.deleteSchool(school.schoolId);
          this.dialogService.infoDialog(
            'Éxito',
            'El recurso ha sido eliminado correctamente.'
          );
        } else {
          this.dialogService.infoDialog(
            'Cancelado',
            'No se realizó la acción.'
          );
        }
      });
  }

  // Función para mostrar recursos activos o deshabilitados
  disableSchool(school: School) {
    if (!school.schoolId) {
      console.error('ID de la escuela es indefinido');
      return;
    }
    this.dialogService
      .confirmDialog({
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de que deseas eliminar esta escuela?',
        type: 'confirm',
      })
      .subscribe(async (result) => {
        if (result) {
          await this.schoolService.disableSchool(school.schoolId);
          this.dialogService.infoDialog(
            'Éxito',
            'La escuela ha sido eliminada correctamente.'
          );
        } else {
          this.dialogService.infoDialog(
            'Cancelado',
            'No se realizó la acción.'
          );
        }
      });
  }

enableSchool(school: School) {
  if (!school.schoolId) {
    console.error('ID de la escuela es indefinido');
    return;
  }
  this.dialogService
    .questionDialog(
      'Confirmar Restablecimiento',
      '¿Estás seguro de que deseas restablecer esta escuela?'
    )
    .subscribe(async (result) => {
      if (result) {
        await this.schoolService.enableSchool(school.schoolId);
        this.dialogService.infoDialog(
          'Éxito',
          'Se restableció el establecimiento correctamente.'
        );
      } else {
        this.dialogService.infoDialog(
          'Cancelado',
          'No se realizó la acción.'
        );
      }
    });
}

  showSchoolsTable() {
    if (this.showDisabledTable) {
      // Si la tabla de deshabilitados ya está activa, mostramos los recursos activos
      this.getEnabledSchools(); // Cargar recursos activos
    } else {
      // Sino está activa, muestra los recursos deshabilitados
      this.getDisabledSchools(); // Cargar recursos deshabilitados
    }
    // Cambiar el valor de showDisabledTable para alternar entre activos y deshabilitados
    this.showDisabledTable = !this.showDisabledTable;
  }
}
