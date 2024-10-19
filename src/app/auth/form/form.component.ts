import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Alumno } from '../../features/Alumnos/alumno.model';
import { AuthService } from '../auth.service';
import { SharedModule } from '../../shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [SharedModule, MatDividerModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  private _formBuilder = inject(FormBuilder);


  // Formulario para los datos personales
  alumnoForm: FormGroup;

  // Formulario para los datos complementarios
  alumnoSecondForm: FormGroup;

  isLinear = true;

  constructor(private authService: AuthService) {
    // Formulario de Datos Personales
    this.alumnoForm = this._formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      // correo: ['', [Validators.required, Validators.email]],
      idTipoUsuario: ['', Validators.required],

    });

    // Formulario de Datos Complementarios
    this.alumnoSecondForm = this._formBuilder.group({
      direccion: [''],
      fechaNacimiento: new FormControl('',),
      cursos: [''],
      telefono: [''],
    });
  }


  onSubmit() {
    console.log(this.alumnoForm);
    console.log(this.alumnoSecondForm);

    // Verifica si el formulario es inválido
    if (this.alumnoForm.invalid || this.alumnoSecondForm.invalid) {
      console.error('Formulario inválido');
      return;  // Si alguno de los formularios es inválido, no se envía
    }

    // Obtiene los datos de los formularios
    const alumnoData = {
      ...this.alumnoForm.value,
      ...this.alumnoSecondForm.value,
    };

    // Obtiene el ID del usuario actual
    const userId = this.authService.getCurrentUserId();

    // Verifica si hay un usuario autenticado    
    if (!userId) {
      console.error('No hay usuario autenticado.');
      return;
    }

    // Si hay un usuario autenticado, se continúa
    console.error('Usuario autenticado.', userId);

    // Llama al servicio para agregar los datos del alumno
    this.authService.addUserData(userId, alumnoData)
      .then(() => {
        console.log('Datos guardados correctamente');
        // Aquí podrías navegar a otra ruta si es necesario
      })
      .catch((error: any) => {
        console.error('Error guardando datos: ', error); // Maneja el error si ocurre
      });
  }
}


