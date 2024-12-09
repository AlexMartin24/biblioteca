import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { GoogleAuthProvider, setPersistence, signInWithPopup } from 'firebase/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { regexMail } from '../../shared/pattern/patterns';
import { User, UserCredentials } from '../usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    // Establecer persistencia a session
    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        // Persistencia establecida
      })
      .catch((error) => {
        console.error('Error al establecer la persistencia:', error);
      });

    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedInSubject.next(!!user);
      if (user) {
        console.log('Usuario autenticado:', user);
      } else {
        console.log('No hay usuario autenticado');
      }
    });
  }

  async login({ email, password }: UserCredentials) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  async logout() {
    await signOut(this.auth);
    this.isLoggedInSubject.next(false);
  }

  async registrarUsuario(credenciales: UserCredentials) {
    // Validaciones
    if (!this.validarMail(credenciales.email)) {
      throw new Error('Formato de correo inválido.');
    }
    if (!this.validarContasena(credenciales.password)) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }

    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      credenciales.email,
      credenciales.password
    );

    const user = userCredential.user;
    const userRef = doc(this.firestore, `usuarios/${user.uid}`);

    // guardar el email en Firestore
    await setDoc(userRef, {
      email: user.email,
      isDeleted: false,
      createdAt: new Date().toISOString(), // Guarda la fecha actual
    });
    return user.uid; // Devolver el ID del usuario para usarlo más tarde
  }

  async loginWithGoogle() {
    return await this.registerWithGoogle();
  }

  async obtenerDatosUsuario(userId: string): Promise<User | null> {
    const userRef = doc(this.firestore, `usuarios/${userId}`);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      return null;
    }
  }

  // async obtenerUsuariosEliminados(userId: string): Promise<User | null> {
  //   const userRef = doc(this.firestore, `usuarios/${userId}`);
  //   const docSnap = await getDoc(userRef);
  //   if (docSnap.exists()) {
  //     if (userRef.isDeleted = false){
      
  //       return docSnap.data() as User;

  //   }
  //   return docSnap.data() as User;
  //   }
  //   else {
  //     return null;
  //   }
  // }


  async agregarDatosUsuario(userId: string, userData: User) {
    const userRef = doc(this.firestore, `usuarios/${userId}`);
    // merge: true para no sobrescribir el email si ya existe
    return setDoc(userRef, userData, { merge: true });
  }

  async registerWithGoogle() {
    const userCredential = await signInWithPopup(this.auth, new GoogleAuthProvider());
    const user = userCredential.user;

    const userRef = doc(this.firestore, `usuarios/${user.uid}`);

    // Verifica si el usuario ya existe
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      // Guardar datos básicos en Firestore
      await setDoc(userRef, {
        correo: user.email,
        nombre: user.displayName!.split(' ')[0], // Nombre
        apellido: user.displayName!.split(' ')[2] || '', // Apellido
        photoURL: user.photoURL || '', // URL de la foto de perfil
        isDeleted: false,
        createdAt: new Date().toISOString(),
      });
      return { uid: user.uid, newUser: true }; // Indicar que es un nuevo usuario
    } else {
      return { uid: user.uid, newUser: false }; // Indicar que ya existe
    }
  }

  private validarContasena(password: string): boolean {
    return password.length >= 6;
  }

  private validarMail(email: string): boolean {
    const regex = new RegExp(regexMail);
    return regex.test(email);
  }

  obtenerIDUsuario(): string | null {
    const user = this.auth.currentUser;
    console.log(user);
    return user ? user.uid : null;
  }
}
