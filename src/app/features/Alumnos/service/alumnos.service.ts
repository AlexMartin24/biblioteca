import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alumno, NuevoAlumno } from '../alumno.model';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import firebase, { FirebaseError } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  obtenerAlumnosActivos(): Observable<Alumno[]> {
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

  obtenerAlumnosEliminados(): Observable<Alumno[]> {
    // referencia a la colección usuarios
    const usuariosRef = collection(this.firestore, 'usuarios');

    // crea un nuevo Observable y suscribirse
    return new Observable<Alumno[]>((subscriber) => {
      // crea la consulta para obtener solo los usuarios no eliminados
      const obtenerUsuariosActivos = query(
        usuariosRef,
        where('isDeleted', '==', true)
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
  //Recuperar usuarios eliminados
  async getUsersDeleted() {
    const querySnapshot = await getDocs(
      query(
        collection(this.firestore, 'usuarios'),
        where('isDeleted', '==', true)
      )
    );
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
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
      updatedAt: new Date().toISOString(),
    });
  }

//   async deleteUser(userId: string) {
//     const userRef = doc(this.firestore, `usuarios/${userId}`);

//     // Actualiza isDeleted a true
//     return setDoc(userRef, { isDeleted: true }, { merge: true });
// }


  async addUser(nuevoAlumno: NuevoAlumno): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        nuevoAlumno.correo,
        nuevoAlumno.apellido + 'Temporal'
      );

      const uid = userCredential.user.uid;
      const userRef = doc(this.firestore, `usuarios/${uid}`);

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
    } catch (error) {
      if (error instanceof FirebaseError) {
        // Lanza un error con un mensaje para que el componente lo capture
        throw new Error(this.handleError(error));
      } else {
        console.error('Error desconocido:', error);
        throw new Error('Error desconocido al crear el usuario.');
      }
    }
  }

  //errores de firebase
  private handleError(error: firebase.FirebaseError): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Este correo ya está en uso. Por favor, utiliza otro.';
      case 'auth/invalid-email':
        return 'El formato del correo electrónico es inválido.';
      case 'auth/operation-not-allowed':
        return 'La operación no está permitida.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      default:
        return 'Error al crear el usuario: ' + error.message;
    }
  }
}
