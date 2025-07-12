import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, NewUser } from '../model/user.model';
import {
  collection, doc, Firestore, getDoc, getDocs, onSnapshot, query, setDoc, Timestamp, updateDoc, where,
} from '@angular/fire/firestore';

import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import firebase, { FirebaseError } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private auth: Auth, private firestore: Firestore) { }


  getActiveUsers(): Observable<User[]> {
    // referencia a la colección users
    const usersRef = collection(this.firestore, 'users');

    // crea un nuevo Observable y suscribirse
    return new Observable<User[]>((subscriber) => {
      // crea la consulta para obtener solo los users habilitados
      const getActiveUsers = query(
        usersRef,
        where('enabled', '==', false)
      );

      // onSnapshot se usa para detectar los cambios en la colección users
      const unsubscribe = onSnapshot(
        getActiveUsers,
        (userSnapshots) => {
          // mapear el documento a un Array de Users
          const users: User[] = userSnapshots.docs.map((doc) => {
            // doc.data() devuelve los datos del documento en forma de objeto.
            const jsonUser = doc.data();

            // Cambia birthdate de Timestamp a Date
            if (jsonUser['birthdate'] instanceof Timestamp) {
              jsonUser['birthdate'] =
                jsonUser['birthdate'].toDate();
            }

            return {
              idUser: doc.id,
              ...jsonUser,
            } as User;
          });
          // Emitir los users actualizados
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




  getUsersByStatus(enabled: boolean): Observable<User[]> {
  const usersRef = collection(this.firestore, 'users');

  return new Observable<User[]>((subscriber) => {
    const usersQuery = query(usersRef, where('enabled', '==', enabled));

    const unsubscribe = onSnapshot(
      usersQuery,
      (userSnapshots) => {
        const users: User[] = userSnapshots.docs.map((doc) => {
          const jsonUser = doc.data();

          if (jsonUser['birthdate'] instanceof Timestamp) {
            jsonUser['birthdate'] = jsonUser['birthdate'].toDate();
          }

          return {
            idUser: doc.id,
            ...jsonUser,
          } as User;
        });

        subscriber.next(users);
      },
      (error) => {
        subscriber.error(error);
      }
    );

    return () => unsubscribe();
  });
}


}
