import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { School } from '../model/school.model';
import { Observable } from 'rxjs';
import { SchoolDialogComponent } from '../school-dialog/school-dialog.component';

type DialogMode = 'create' | 'edit';

@Injectable({
  providedIn: 'root',
})
export class SchoolDialogService {
  constructor(private dialog: MatDialog) {}

  openSchoolDialog(options: {
    mode: DialogMode;
    data?: School;
  }): Observable<School> {
    const dialogRef = this.dialog.open(SchoolDialogComponent, {
      disableClose: true,
      width: '600px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: {
        mode: options.mode,
        school:
          options.mode === 'edit'
            ? options.data
            : {
                schoolId: '',
                name: '',
                cue: '',
                province: '',
                locality: '',
                address: '',
                phone: '',
                email: '',
                createdAt: null,
                enabled: true,
              },
      },
    });

    return dialogRef.afterClosed();
  }
}
