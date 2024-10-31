import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginUser!: FormGroup;

  constructor(private loginService: AuthService, private router: Router) {
    this.loginUser = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  // ngOnInit(): void {}

  onSubmit() {
    console.log(this.loginUser.value);

    this.loginService
      .login(this.loginUser.value)
      .then((response) => {
        // console.log(response);
        this.router.navigate(['/cursos']);
      })
      .catch((error) => console.log(error));
  }


  register() {
    this.router.navigate(['/auth/registrarse']);
  }
}
