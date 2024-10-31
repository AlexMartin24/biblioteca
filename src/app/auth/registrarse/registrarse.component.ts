import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { regexMail, regexPassword } from '../../shared/pattern/patterns';

@Component({
  selector: 'app-registrarse',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.css',
})
export class RegistrarseComponent {
  formUsuario!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.formUsuario = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(regexMail),
        Validators.maxLength(30),
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
  letraMinuscula: boolean = false;
  letraMayuscula: boolean = false;
  numero: boolean = false;
  minimoCaracteres: boolean = false;

  validarContasena() {
    const password = this.formUsuario.controls['password'].value;
    this.letraMinuscula = /[a-z]/.test(password);
    this.letraMayuscula = /[A-Z]/.test(password);
    this.numero = /[0-9]/.test(password);
    this.minimoCaracteres = password.length >= 6;
  }

  async registrarUsuario() {
    if (this.formUsuario.invalid) {
      console.log('Formulario no válido', this.formUsuario.errors);
      return;
    }

    try {
      await this.authService.registrarUsuario(this.formUsuario.value);
      // console.log(this.formUsuario.value);
      this.router.navigate(['/form']);
    } catch (error) {
      console.log(error);
    }
  }
}
