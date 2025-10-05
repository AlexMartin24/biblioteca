import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Resource } from '../model/resource.model';
import { ResourceDialogComponent } from './resource-dialog/resource-dialog.component';

type DialogMode = 'create' | 'edit';

@Injectable({
  providedIn: 'root',
})
export class ResourceDialogService {
  constructor(private dialog: MatDialog) {}

  openResourceDialog(options: {
    mode: DialogMode;
    data?: Resource;
  }): Observable<Resource> {
    const dialogRef = this.dialog.open(ResourceDialogComponent, {
      disableClose: true,
      width: '600px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: {
        mode: options.mode,
        resource:
          options.mode === 'edit'
            ? options.data
            : {
                resourceId: '',
                title: '',
                type: 'LIBRO',
                serialnumber: '',
                totalAmount: '',
                availableQuantity: '',
              },
      },
    });

    return dialogRef.afterClosed();
  }
}
