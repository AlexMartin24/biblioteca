import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CursosService } from '../cursos.service';
import { Cursos } from '../curso.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MatSelectChange } from '@angular/material/select';
import { Profesor } from '../../Profesor/profesor.model';
import { ProfesorService } from '../../Profesor/services/profesor.service';

@Component({
  selector: 'app-dialog-curso',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dialog-curso.component.html',
  styleUrl: './dialog-curso.component.css',
})
export class DialogCursoComponent {
  formularioEditar!: FormGroup;
  cursosObtenidos: Cursos[] = [];

  selectedProfesor?: Profesor;
  profesoresObtenidos: Profesor[] = [];

  constructor(
    private dialogRef: MatDialogRef<DialogCursoComponent>,
    private cursosService: CursosService,
    private profesorService: ProfesorService,

    @Inject(MAT_DIALOG_DATA) public data: Cursos
  ) {
    {
      const regexTextos: string = '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ.\\- ]{1,50}$';

      this.formularioEditar = new FormGroup({
        id: new FormControl(data.idCurso, [
          Validators.min(1),
          Validators.max(9999),
        ]),
        nombreCurso: new FormControl(data.nombreCurso, [
          // Validators.required,
          Validators.pattern(regexTextos),
        ]),
        comision: new FormControl(data.comision, [
          // Validators.required,
          // Validators.pattern(regexTextos),
        ]),

        descripcion: new FormControl(data.descripcion, [
          // Validators.required,
          Validators.pattern(regexTextos),
        ]),

        fechaInicio: new FormControl(data.fechaInicio, [
          // Validators.required,
          // Validators.pattern(regexTextos),
        ]),

        fechaFin: new FormControl(data.fechaFin, [
          // Validators.required,
          // Validators.pattern(regexTextos),
        ]),
        presencial: new FormControl(data.presencial || false),

        // nombre: new FormControl(data.profesor.nombre || '', [
        //   Validators.required,
        //   Validators.pattern(regexTextos),
        // ]),
        // apellido: new FormControl(data.profesor.apellido || '', [
        //   Validators.required,
        //   Validators.pattern(regexTextos),
        // ]),
        idProfesor: new FormControl(data.idProfesor, [
          Validators.min(1),
          Validators.max(9999),
        ]),

      });
    }
  }

  ngOnInit(): void {
    this.obtenerProfesores();
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

  obtenerProfesores() {
    this.profesorService
      .ObtenerProfesoresObservable()
      .subscribe((profesores) => {
        this.profesoresObtenidos = profesores;
        // console.log('Profesores Obtenidos: ', this.profesoresObtenidos);
      });
  }

  onProfesorSeleccionado(event: MatSelectChange): void {
    if (event?.value) {
      this.selectedProfesor = event.value;
      this.formularioEditar.patchValue({
        nombre: this.selectedProfesor?.nombre || '',
        apellido: this.selectedProfesor?.apellido || '',
      });
      console.log('Profesor Seleccionado: ', this.selectedProfesor);
    } else {
      console.error('El valor seleccionado es undefined');
    }
  }
}
