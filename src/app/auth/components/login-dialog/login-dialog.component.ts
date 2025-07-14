import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../service/auth.service';
import { UserCredentials } from '../../../features/Users/model/user.model';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [SharedModule, MatDialogModule],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.css'
})
export class LoginDialogComponent {
  loginUser!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,

    @Inject(MAT_DIALOG_DATA) public data: UserCredentials
  ) {
    this.loginUser = new FormGroup({
      email: new FormControl(data.email, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(data.password, [
        Validators.required,
      ]),
    });
  }

  loginGoogle() {
    this.authService.loginWithGoogle()
      .then(response => {
        if (response.newUser) {
          this.router.navigate(['/form']); // Redirigir al formulario
        } else {
          this.router.navigate(['/cursos']); // Redirigir a la página de cursos
        }
        this.dialogRef.close();
      })
      .catch(error => console.log(error));
  }

  enviarForm() {
    console.log(this.loginUser.value);
    this.authService.login(this.loginUser.value)
      .then(() => {
        // Cierra el diálogo
        this.dialogRef.close();
        // Redirige a otra página
        this.router.navigate(['/cursos']);
      })
      .catch(error => console.log(error));
  }

  registerDialog() {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      data: { email: '', password: '' },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El registro fue cerrado', result);
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
