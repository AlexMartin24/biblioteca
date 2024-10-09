import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {


  isLoggedIn$!: Observable<boolean>;

  constructor(private router: Router, private loginService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.loginService.isLoggedIn$;
  }

  cerrarSesion() {
    this.loginService
      .logout()
      .then(() => {
        this.router.navigate(['/alumnos']);

      })
      .catch((error) => console.log(error));
  }

  redirectToLogin() {
    this.router.navigate(['/auth/iniciar-sesion']);
  }
}

