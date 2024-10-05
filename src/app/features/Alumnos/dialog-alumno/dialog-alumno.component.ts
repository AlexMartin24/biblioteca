import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Alumno } from '../alumno.model';
import { AlumnosService } from '../alumnos.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-dialog-alumno',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dialog-alumno.component.html',
  styleUrl: './dialog-alumno.component.css',
})
export class DialogAlumnoComponent {
  formularioEditar!: FormGroup;
  alumnosObtenidos: Alumno[] = [];

  constructor(
    private dialogRef: MatDialogRef<DialogAlumnoComponent>,
    private alumnosService: AlumnosService,

    @Inject(MAT_DIALOG_DATA) public data: Alumno
  ) {
    {
      const regexTextos: string = '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ.\\- ]{1,50}$';

      this.formularioEditar = new FormGroup({
        id: new FormControl(data.idAlumno, [
          Validators.min(1),
          Validators.max(9999),
        ]),
        nombre: new FormControl(data.nombre, [
          Validators.required,
          Validators.pattern(regexTextos),
        ]),
        apellido: new FormControl(data.apellido, [
          Validators.required,
          Validators.pattern(regexTextos),
        ]),

        correo: new FormControl(data.correo, [
          // Validators.required,
          // Validators.pattern(regexTextos),
        ]),

        direccion: new FormControl(data.direccion, [
          // Validators.required,
          // Validators.pattern(regexTextos),
        ]),

        fechaNacimiento: new FormControl(data.fechaNacimiento, [
          // Validators.required,
          // Validators.pattern(regexTextos),
        ]),

        telefono: new FormControl(data.telefono, [
          // Validators.required,
          // Validators.pattern(regexTextos),
        ]),
      });
    }
  }

  aceptar() {
    if (this.formularioEditar.valid) {
      // console.log('Valor de Presencial:', this.formularioEditar.value.presencial); // Verificar valor de T or F presencial
      this.dialogRef.close(this.formularioEditar.value); // Cierra el diálogo y pasa los datos del formulario
      console.log('Form completado:', this.formularioEditar.value); // Verificar valor del form
    } else {
      this.formularioEditar.markAllAsTouched(); // Marca todos los campos como tocados para mostrar los errores
    }
  }

  Cancelar() {
    this.dialogRef.close(); // Cierra el diálogo sin pasar datos
  }
}
