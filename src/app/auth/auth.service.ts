import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore'; // Importa Firestore y las funciones necesarias
import { Observable, BehaviorSubject } from 'rxjs';
import { Usuario } from './usuario.model';
import { Alumno } from '../features/Alumnos/alumno.model';

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

  // Crear el usuario.
  async register({ email, password, additionalData }: any) {
    // userCredential Devuelve un objeto que contiene información sobre el usuario registrado
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;


    // Guardar datos adicionales en Firestore
    // al utilizar (usuarios/${user.uid}) se garantiza que cada usuario tenga su propio documento en la colección
    const userRef = doc(this.firestore, `usuarios/${user.uid}`);
    // setDoc() es una función para guardar o actualizar datos en el documento
    await setDoc(userRef, {
      email: user.email,
      ...additionalData,
    });
  }

  getCurrentUserId(): string | null {
    const user = this.auth.currentUser; // Obtiene el usuario actualmente autenticado
    return user ? user.uid : null; // Devuelve el ID del usuario o null si no está autenticado
  }

  addUserData(idUsuario: string, additionalData: any) {
    const userRef = doc(this.firestore, `usuarios/${idUsuario}`);
    return setDoc(userRef, additionalData);
  }

  
  async getUsers(): Promise<Alumno[]> {
    const usersRef = collection(this.firestore, 'usuarios');
    const userSnapshots = await getDocs(usersRef);

    const users: Alumno[] = userSnapshots.docs.map(doc => ({
      idAlumno: doc.id,
      ...doc.data()
    })) as unknown  as Alumno[];

    return users;
  }

  async updateUserData(idUsuario: string, editarAlumno: Partial<Alumno>): Promise<void> {
    const userRef = doc(this.firestore, `usuarios/${idUsuario}`);
    // console.log('ID del alumno:', idUsuario);
    await updateDoc(userRef, editarAlumno);
}

  

}
