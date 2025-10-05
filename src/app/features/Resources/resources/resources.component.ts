import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NewResource, Resource, ResourceType } from '../model/resource.model';
import { ResourceService } from '../services/resource.service';
import { ResourceDialogService } from '../services/resource-dialog.service';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css',
})
export class ResourcesComponent {
  resources$!: Resource[];
  displayedColumns: string[] = [
    'Type',
    'Author',
    'Title',
    'Name',
    'ISBN',
    'SerialNumber',
    'Brand',
    'DateAdmission',

    // 'TotalAmount',
    // 'CreatedAt',
    'Actions',
  ];

  // DataSource de los resources
  dataSource = new MatTableDataSource<Resource>();

  // Control para mostrar tabla de eliminados
  showDisabledTable: boolean = false;

  // @ViewChild(MatPaginator) permite acceder al componente MatPaginator en tu plantilla
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private dialog: MatDialog,
    private resourceService: ResourceService,
    private dialogService: DialogService,
    private resourceDialogService: ResourceDialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEnabledResources();
  }

  getEnabledResources() {
    this.resourceService.getResourcesByStatus(true).subscribe({
      next: (enabledResources) => {
        this.dataSource.data = enabledResources;
        console.log('Recursos habilitados:', enabledResources);
      },
      error: (error) => {
        console.error('Error al obtener recursos habilitados:', error);
      },
    });
  }

  getDisabledResources() {
    this.resourceService.getResourcesByStatus(false).subscribe({
      next: (disabledResources) => {
        this.dataSource.data = disabledResources;
        console.log('Recursos deshabilitados:', disabledResources);
      },
      error: (error) => {
        console.error('Error al obtener recursos deshabilitados:', error);
      },
    });
  }

  addResource() {
    this.resourceDialogService
      .openResourceDialog({ mode: 'create' })
      .subscribe((result) => {
        if (result) {
          const newResource: NewResource = {
            author: result.author,
            brand: result.brand,
            dateAdmission: result.dateAdmission,
            description: result.description,
            isbn: result.isbn,
            name: result.name,
            title: result.title,
            editorial: result.editorial,
            type: result.type,
            state: result.state,
            serialNumber: result.serialNumber,
            totalAmount: result.totalAmount,
            availableQuantity: result.availableQuantity,
            // escuelaId: result.escuelaId,
            escuelaId: '123456', // Temporal hasta tener autenticación
            enabled: true,
            createdAt: new Date().toISOString(),
          };

          this.resourceService
            .addResource(newResource)
            .then(() => {
              console.log('Datos enviados:', newResource);
              this.dialogService.infoDialog(
                'Éxito',
                'Recurso creado correctamente.'
              );
              this.getEnabledResources();
            })
            .catch((error) => {
              console.log('Datos enviados:', newResource);
              this.dialogService.errorDialog('Error', error.message);
            });
        }
      });
  }

  editResource(resource: Resource) {
    if (!resource.resourceId) {
      this.dialogService.errorDialog(
        'Error',
        'No se puede editar un recurso sin ID.'
      );
      return;
    }

    this.resourceDialogService
      .openResourceDialog({ mode: 'edit', data: resource })
      .subscribe(async (result) => {
        if (result) {
          try {
            await this.resourceService.updateResourceData(
              resource.resourceId,
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

  deleteResource(resource: Resource) {
    if (!resource.resourceId) {
      console.error('ID del resource es indefinido');
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
          await this.resourceService.deleteResource(resource.resourceId);
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
  disableResource(resource: Resource) {
    if (!resource.resourceId) {
      console.error('ID del resource es indefinido');
      return;
    }
    this.dialogService
      .confirmDialog({
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de que deseas eliminar este recurso?',
        type: 'confirm',
      })
      .subscribe(async (result) => {
        if (result) {
          await this.resourceService.disableResource(resource.resourceId);
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

  enableResource(resource: Resource) {
    if (!resource.resourceId) {
      console.error('ID del resource es indefinido');
      return;
    }
    this.dialogService
      .confirmDialog({
        title: 'Confirmar alta del recurso',
        message: '¿Estás seguro de que deseas dar de alta este recurso?',
        type: 'enable',
      })
      .subscribe(async (result) => {
        if (result) {
          await this.resourceService.enableResource(resource.resourceId);
          this.dialogService.infoDialog(
            'Éxito',
            'El recurso ha sido dado de alta correctamente.'
          );
        } else {
          this.dialogService.infoDialog(
            'Cancelado',
            'No se realizó la acción.'
          );
        }
      });
  }

  showResourcesTable() {
    if (this.showDisabledTable) {
      // Si la tabla de deshabilitados ya está activa, mostramos los recursos activos
      this.getEnabledResources(); // Cargar recursos activos
    } else {
      // Sino está activa, muestra los recursos deshabilitados
      this.getDisabledResources(); // Cargar recursos deshabilitados
    }
    // Cambiar el valor de showDisabledTable para alternar entre activos y deshabilitados
    this.showDisabledTable = !this.showDisabledTable;
  }
}
