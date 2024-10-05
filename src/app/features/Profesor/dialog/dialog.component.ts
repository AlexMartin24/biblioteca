import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Estado, Profesor } from '../profesor.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfesorService } from '../profesor.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  formularioEditar!: FormGroup;
  profesoresObtenidos: Profesor[] = [];
  estadosPosibles: Estado[] = [];

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    private profesoresService: ProfesorService,
    @Inject(MAT_DIALOG_DATA) public data: Profesor
  ) {
    const regexTextos: string = '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ.\\- ]{1,50}$';

    this.formularioEditar = new FormGroup({
      id: new FormControl(data.idProfesor, [
        Validators.min(1),
        Validators.max(9999),
      ]),
      nombre: new FormControl(data.nombre, [
        // Validators.required,
        Validators.pattern(regexTextos),
      ]),
      apellido: new FormControl(data.apellido, [
        // Validators.required,
        Validators.pattern(regexTextos),
      ]),
      correo: new FormControl(data.correo, []),
      telefono: new FormControl(data.telefono, []),
      // especialidad: new FormControl(data.especialidad, [
      //   // Validators.required,
      //   Validators.pattern(regexTextos),
      // ]),
      estudios: new FormControl(data.estudios || []),
      estado: new FormControl(data.estado[0]?.idEstado, []),
      cursos: new FormControl(data.cursos || []),

    });
  }

  ngOnInit(): void {
    this.obtenerProfesores();
  }

  obtenerProfesores() {
    this.profesoresService
      .ObtenerProfesoresObservable()
      .subscribe((profesores) => {
        this.profesoresObtenidos = profesores;
      });
    this.obtenerEstados();
  }

  obtenerEstados() {
    this.estadosPosibles = this.profesoresService.ObtenerEstadosPosibles();
  }

  aceptar() {
    if (this.formularioEditar.valid) {
      const formData = this.formularioEditar.value;

      // find para buscar en el array estadosPosibles. obtiene el estado correcto a partir del idEstado
      const estadoSeleccionado = this.estadosPosibles.find(
        (e) => e.idEstado === Number(formData.estado)
      );

      if (!estadoSeleccionado) {
        console.error('Estado no encontrado:', formData.estado);
        return; // Evita cerrar el diálogo si el estado no es válido
      }

      // Crea el objeto estado con el id y el nombre correctos
      formData.estado = [
        {
          idEstado: estadoSeleccionado.idEstado,
          nombre: estadoSeleccionado.nombre,
        },
      ];
      this.dialogRef.close(formData);
    } else {
      this.formularioEditar.markAllAsTouched();
    }
  }

  Cancelar() {
    this.dialogRef.close(); // Cierra el diálogo sin pasar datos
  }
}
