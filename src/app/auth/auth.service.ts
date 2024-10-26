import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from '@angular/fire/auth';
import {
  Firestore,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore'; // Importa Firestore y las funciones necesarias
import { Observable, BehaviorSubject } from 'rxjs';
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
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
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

  getUsers(): Observable<Alumno[]> {
    // referencia a la colección usuarios
    const usuariosRef = collection(this.firestore, 'usuarios');

    // crea un nuevo Observable y suscribirse
    return new Observable<Alumno[]>((subscriber) => {
      // onSnapshot se usa para detectar los cambios en la colección usuarios
      const unsubscribe = onSnapshot(
        usuariosRef,
        (userSnapshots) => {
          // mapear el documento a un Array de Alumnos
          const users: Alumno[] = userSnapshots.docs.map((doc) => {
            // doc.data() devuelve los datos del documento en forma de objeto.
            const jsonAlumno = doc.data();

            // Cambia fechaNacimiento de Timestamp a Date
            if (jsonAlumno['fechaNacimiento'] instanceof Timestamp) {
              jsonAlumno['fechaNacimiento'] = jsonAlumno['fechaNacimiento'].toDate();
            }

            return {
              idAlumno: doc.id,
              ...jsonAlumno,
            } as Alumno;
          });
          // Emitir los usuarios actualizados
          subscriber.next(users); 
        },
        (error) => {
          // Si ocurre un error en la operación de onSnapshot, se emite un error al subscriber
          subscriber.error(error);
        }
      );
      // Devolver la función de limpieza al desuscribirse
      return () => unsubscribe();
    });
  }

  async updateUserData(
    idUsuario: string,
    editarAlumno: Partial<Alumno>
  ): Promise<void> {
    const userRef = doc(this.firestore, `usuarios/${idUsuario}`);
    // console.log('ID del alumno:', idUsuario);
    await updateDoc(userRef, editarAlumno);
  }

  async getUser(idUsuario: string): Promise<Alumno | null> {
    try {
      const document = doc(this.firestore, `usuarios/${idUsuario}`);
      const snapshot = await getDoc(document);
      // console.log('datos del alumno:', snapshot.data());

      return snapshot.data() as Alumno | null; // Devolver Alumno o null
    } catch (error) {
      console.error('No se encontró el usuario', error);
      return null; // en caso de error, retornar null
    }
  }
}
