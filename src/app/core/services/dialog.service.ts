import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../core/components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}
  /**
   * Abre un diálogo de confirmación genérico (aceptar/cancelar).
   * Retorna un observable con el resultado booleano.
   */
  confirmDialog(options: {
    title: string;
    message: string;
    type?: 'confirm' | 'info' | 'error' | 'enable';
  }) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: options.title,
        message: options.message,
        type: options.type || 'confirm',
      },
    });

    return dialogRef.afterClosed(); // observable<boolean>
  }

  /**
   * Muestra un mensaje informativo (sin opciones).
   */
  infoDialog(title: string, message: string) {
    return this.confirmDialog({ title, message, type: 'info' });
  }

  /**
   * Muestra un mensaje de error.
   */
  errorDialog(title: string, message: string) {
    return this.confirmDialog({ title, message, type: 'error' });
  }
}
