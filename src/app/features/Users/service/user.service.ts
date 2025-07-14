import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, NewUser } from '../model/user.model';
import {
  collection, doc, Firestore, getDoc, getDocs, onSnapshot, query, setDoc, Timestamp, updateDoc, where,
} from '@angular/fire/firestore';

import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import firebase, { FirebaseError } from 'firebase/app';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private auth: Auth, private firestore: Firestore, private errorHandler: ErrorHandlerService
  ) { }


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
              userId: doc.id,
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

  async addUser(newUser: NewUser): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        newUser.email,
        newUser.lastname + 'Temporal'
      );

      const uid = userCredential.user.uid;
      const userRef = doc(this.firestore, `users/${uid}`);

      await setDoc(userRef, {
        address: newUser.address,
        email: newUser.email,
        lastname: newUser.lastname,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
        birthdate: newUser.birthdate,
        schooldId: newUser.schooldId,
        enabled: newUser.enabled,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(this.errorHandler.handleFirebaseError(error));
      } else {
        this.errorHandler.log(error);
        throw new Error('Error desconocido al crear el usuario.');
      }
    }
  }


  async updateUserData(
    userId: string,
    editUser: Partial<User>
  ): Promise<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    // console.log('ID del usuario:', userId);
    await updateDoc(userRef, editUser);
  }

  async deleteUser(uid: string) {
    const userRef = doc(this.firestore, `users/${uid}`);

    // Asegúrate de que uid es una cadena válida antes de intentar actualizar
    await updateDoc(userRef, {
      enabled: false,
      updatedAt: new Date().toISOString(),
    });
  }




}
