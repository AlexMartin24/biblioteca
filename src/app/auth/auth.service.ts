import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore'; // Importa Firestore y las funciones necesarias
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  // isLoggedInSubject: Es un BehaviorSubject que almacena el estado de si el usuario está o no autenticado 
  // (inicio de sesión). Inicialmente está en false, lo que significa que el usuario no está autenticado.

  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  // isLoggedIn$: Es un Observable que permite a otros componentes suscribirse a este estado
  // y reaccionar de manera reactiva a los cambios.


  constructor(private auth: Auth, private firestore: Firestore) {
    // Establece el estado de inicio de sesión inicial según el usuario actual
    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedInSubject.next(!!user); // Actualizar user con valor booleano
    });
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  async register({ email, password, additionalData }: any) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    // Guardar datos adicionales en Firestore
    const userRef = doc(this.firestore, `usuarios/${user.uid}`);
    await setDoc(userRef, {
      email: user.email,
      ...additionalData,
    });
  }

  getCurrentUserId(): string | null {
    const user = this.auth.currentUser; // Obtiene el usuario actualmente autenticado
    return user ? user.uid : null; // Devuelve el ID del usuario o null si no está autenticado
  }

  addUserData(userId: string, additionalData: any) {
    const userRef = doc(this.firestore, `usuarios/${userId}`);
    return setDoc(userRef, additionalData);
  }

  
}
