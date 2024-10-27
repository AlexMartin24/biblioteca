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
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore'; // Importa Firestore y las funciones necesarias
import { Observable, BehaviorSubject } from 'rxjs';
import { Alumno, NuevoAlumno } from '../features/Alumnos/alumno.model';

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
    if (email.length > 30) {
      throw new Error('El correo no puede exceder los 50 caracteres.');
    }
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


  
  async addUser(nuevoAlumno: NuevoAlumno) {
    // Crear un nuevo usuario (puedes personalizar el email y password)

    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      nuevoAlumno.correo,
      'Temporal'
    );


    // Obtener el UID del nuevo usuario
    const uid = userCredential.user.uid;

    // Referencia al documento usando el UID
    const userRef = doc(this.firestore, `usuarios/${uid}`);

    // Guardar los datos del alumno en el documento correspondiente
    await setDoc(userRef, {
      nombre: nuevoAlumno.nombre,
      apellido: nuevoAlumno.apellido,
      correo: nuevoAlumno.correo,
      fechaNacimiento: nuevoAlumno.fechaNacimiento,
      telefono: nuevoAlumno.telefono,
      direccion: nuevoAlumno.direccion,
      idTipoUsuario: nuevoAlumno.idTipoUsuario,
      isDeleted: nuevoAlumno.isDeleted,
      createdAt: new Date().toISOString(),

    });
  }



  // async cambiarContraseña(nuevaContraseña: string) {
  //   const user = getAuth().currentUser;
  
  //   if (user) {
  //     try {
  //       await updatePassword(user, nuevaContraseña);
  //       console.log("Contraseña cambiada exitosamente");
  //       // Redirigir al usuario o mostrar un mensaje de éxito
  //     } catch (error) {
  //       console.error("Error al cambiar la contraseña: ", error);
  //       // Manejar el error adecuadamente
  //     }
  //   } else {
  //     console.error("No hay un usuario autenticado");
  //   }
  // }


  

  obtenerAlumnosFirebase(): Observable<Alumno[]> {
    // referencia a la colección usuarios
    const usuariosRef = collection(this.firestore, 'usuarios');

    // crea un nuevo Observable y suscribirse
    return new Observable<Alumno[]>((subscriber) => {
      // crea la consulta para obtener solo los usuarios no eliminados
      const obtenerUsuariosActivos = query(
        usuariosRef,
        where('isDeleted', '==', false)
      );

      // onSnapshot se usa para detectar los cambios en la colección usuarios
      const unsubscribe = onSnapshot(
        obtenerUsuariosActivos,
        (userSnapshots) => {
          // mapear el documento a un Array de Alumnos
          const users: Alumno[] = userSnapshots.docs.map((doc) => {
            // doc.data() devuelve los datos del documento en forma de objeto.
            const jsonAlumno = doc.data();

            // Cambia fechaNacimiento de Timestamp a Date
            if (jsonAlumno['fechaNacimiento'] instanceof Timestamp) {
              jsonAlumno['fechaNacimiento'] =
                jsonAlumno['fechaNacimiento'].toDate();
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


  

  async getUsersDeleted() {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'usuarios'), where('isDeleted', '==', true)));
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return users;
  }
  

  async updateUserData(
    idUsuario: string,
    editarAlumno: Partial<Alumno>
  ): Promise<void> {
    const userRef = doc(this.firestore, `usuarios/${idUsuario}`);
    // console.log('ID del alumno:', idUsuario);
    await updateDoc(userRef, editarAlumno);
  }

  async deleteUser(uid: string) {
    const userRef = doc(this.firestore, `usuarios/${uid}`);
  
    // Asegúrate de que uid es una cadena válida antes de intentar actualizar
    await updateDoc(userRef, {
      isDeleted: true,
      updatedAt: new Date().toISOString()
    });
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
