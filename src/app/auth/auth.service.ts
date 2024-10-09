import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { Alumno } from '../features/Alumnos/alumno.model';



@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private user$ = new BehaviorSubject<Alumno | null>(null);

  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private auth: Auth,
  )
  {
    // Establece el estado de inicio de sesión inicial según el usuario actual
    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedInSubject.next(!!user); // Actualizar user con valor booleano
    });
  }

  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }


}
