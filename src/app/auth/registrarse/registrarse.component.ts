import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { regexMail, regexPassword } from '../../shared/pattern/patterns';

@Component({
  selector: 'app-registrarse',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.css',
})
export class RegistrarseComponent {
  registerUser!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.registerUser = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(regexMail),
        Validators.maxLength(30), // Limitar los caracteres
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(regexPassword),
        Validators.minLength(6), // Limitar los caracteres
        Validators.maxLength(16),
      ]),
    });
  }

  //validar contaseñas
  hasLowercase: boolean = false;
  hasUppercase: boolean = false;
  hasNumber: boolean = false;
  isLengthValid: boolean = false;

  validatePassword() {
    const password = this.registerUser.controls['password'].value;
    this.hasLowercase = /[a-z]/.test(password);
    this.hasUppercase = /[A-Z]/.test(password);
    this.hasNumber = /[0-9]/.test(password);
    this.isLengthValid = password.length >= 6;
  }
  //

  async onSubmit() {
    if (this.registerUser.invalid) {
      // Maneja la lógica si el formulario no es válido
      console.log('Formulario no válido', this.registerUser.errors);
      return; // Detener la ejecución aquí
    }

    try {
      await this.authService.register(this.registerUser.value);
      // console.log(this.registerUser.value);
      this.router.navigate(['/form']);
    } catch (error) {
      console.log(error);
    }
  }
}
