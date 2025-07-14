import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';

import {
  regexDireccion,
  regexMail,
  regexNumeros,
  regexTextos,
} from '../../../shared/pattern/patterns';
import { User } from '../model/user.model';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css'
})

export class UserDialogComponent {
  editForm: FormGroup;


  constructor(
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.editForm = new FormGroup({
      name: new FormControl(data.name, [
        Validators.required,
        Validators.pattern(regexTextos),
      ]),
      lastname: new FormControl(data.lastname, [
        Validators.required,
        Validators.pattern(regexTextos),
      ]),
      email: new FormControl(data.email, [
        Validators.required,
        Validators.pattern(regexMail),
      ]),
      address: new FormControl(data.address, [
        Validators.pattern(regexDireccion),
      ]),
      birthdate: new FormControl(data.birthdate, [
        Validators.required,
      ]),
      phone: new FormControl(data.phone, [
        Validators.pattern(regexNumeros),
      ]),
      role: new FormControl(data.role, [
        Validators.pattern(regexTextos),
      ]),
      schooldId: new FormControl(data.schooldId, [
        // Validators.required,
        Validators.pattern(regexTextos),
      ]),

    });
  }

  aceptar() {
    if (this.editForm.valid) {
      const formData = this.editForm.value;
      console.log('Formulario enviado:', formData);
      this.dialogRef.close({
        ...formData,
        userId: this.data.userId,
      });
    } else {
      this.editForm.markAllAsTouched();
      const formData = this.editForm.value;
      console.log('Error al enviar el formulario:', formData);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}
