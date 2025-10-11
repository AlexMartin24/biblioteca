import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SchoolDialogData, SchoolDialogMode } from '../model/school.model';
import { regexAlfanumericoConEspacios, regexNumeros } from '../../../shared/pattern/patterns';

@Component({
  selector: 'app-school-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './school-dialog.component.html',
  styleUrl: './school-dialog.component.css',
})
export class SchoolDialogComponent {
  editForm: FormGroup;
  mode!: SchoolDialogMode;

  constructor(
    private dialogRef: MatDialogRef<SchoolDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SchoolDialogData
  ) {
    this.mode = data.mode;
    const school = data.school;

    this.editForm = new FormGroup({
      name: new FormControl(school.name, [
        Validators.required,
        Validators.pattern(regexAlfanumericoConEspacios),
      ]),
      cue: new FormControl(school.cue, [
        Validators.required,
        Validators.pattern(regexNumeros),
      ]),
      description: new FormControl(school.description, [
        Validators.pattern(regexAlfanumericoConEspacios),
      ]),
      province: new FormControl(school.province, [
        Validators.required,
        Validators.pattern(regexAlfanumericoConEspacios),
      ]),
      locality: new FormControl(school.locality, [
        Validators.required,
        Validators.pattern(regexAlfanumericoConEspacios),
      ]),
      address: new FormControl(school.address, [
        Validators.required,
        Validators.pattern(regexAlfanumericoConEspacios),
      ]),
      contact: new FormControl(school.contact, [
        Validators.pattern(regexAlfanumericoConEspacios),
      ]),
      phone: new FormControl(school.phone, [
        Validators.pattern(regexNumeros),
      ]),
      email: new FormControl(school.email, [
        // Validators.pattern(regexAlfanumericoConEspacios),
      ]),
    });
  }

  sendData() {
    console.log("Enviar datos", this.editForm);
    if (this.editForm.valid) {
      const formData = this.editForm.value;

      this.dialogRef.close({
        ...formData,
        schoolId: this.data.school.schoolId,
      });
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
