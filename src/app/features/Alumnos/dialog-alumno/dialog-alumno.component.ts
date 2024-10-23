import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Alumno } from '../alumno.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { regexDireccion, regexMail, regexNumeros, regexTextos } from '../../../shared/pattern/patterns';
import { Timestamp } from 'firebase/firestore';


@Component({
  selector: 'app-dialog-alumno',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dialog-alumno.component.html',
  styleUrls: ['./dialog-alumno.component.css'],
})
export class DialogAlumnoComponent {
  formularioEditar: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DialogAlumnoComponent>,

    @Inject(MAT_DIALOG_DATA) public data: Alumno
  ) {
    {
      this.formularioEditar = new FormGroup({
        nombre: new FormControl(data.nombre, [
          Validators.required,
          Validators.pattern(regexTextos),
        ]),
        apellido: new FormControl(data.apellido, [
          Validators.required,
          Validators.pattern(regexTextos),
        ]),
        correo: new FormControl(data.correo, [
          Validators.required,
          Validators.pattern(regexMail),
        ]),
        direccion: new FormControl(data.direccion, [
          // Validators.required,
          Validators.pattern(regexDireccion),
        ]),
        fechaNacimiento: new FormControl(data.fechaNacimiento, [
          // Validators.required,
        ]),
        telefono: new FormControl(data.telefono, [
          // Validators.required,
          Validators.pattern(regexNumeros),
        ]),
      });
    }
  }
  
  
  aceptar() {
    // if (this.formularioEditar.invalid) {
    //   this.dialogRef.close(this.formularioEditar.value);
    //   console.log('Form invalido:', this.formularioEditar.value);
    // }

    if (this.formularioEditar.valid) {
      this.dialogRef.close(this.formularioEditar.value);
      console.log('Form completado:', this.formularioEditar.value);
    } else {
      this.formularioEditar.markAllAsTouched();
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

  onFechaNacimientoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const date = new Date(input.value);

    if (!isNaN(date.getTime())) {
      const timestamp = Timestamp.fromDate(date);
      this.formularioEditar.controls['fechaNacimiento'].setValue(timestamp);
    } else {
      this.formularioEditar.controls['fechaNacimiento'].setValue(null);
    }
  }

}
