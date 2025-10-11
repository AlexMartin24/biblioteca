import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { FirebaseError } from 'firebase/app';
import { NewSchool, School } from '../model/school.model';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  constructor(
    private firestore: Firestore,
    private errorHandler: ErrorHandlerService
  ) {}

  getSchoolsByStatus(enabled: boolean): Observable<School[]> {
    const schoolsRef = collection(this.firestore, 'schools');

    return new Observable<School[]>((subscriber) => {
      const schoolsQuery = query(schoolsRef, where('enabled', '==', enabled));

      const unsubscribe = onSnapshot(
        schoolsQuery,
        (schoolSnapshots) => {
          const schools: School[] = schoolSnapshots.docs.map((doc) => {
            const jsonSchool = doc.data();

            return {
              schoolId: doc.id,
              ...jsonSchool,
            } as School;
          });

          subscriber.next(schools);
        },
        (error) => {
          subscriber.error(error);
        }
      );
      return () => unsubscribe();
    });
  }

  async disableSchool(schoolId: string) {
    const schoolRef = doc(this.firestore, `schools/${schoolId}`);

    await updateDoc(schoolRef, {
      enabled: false,
      updatedAt: new Date().toISOString(),
    });
  }

  async enableSchool(schoolId: string) {
    const schoolRef = doc(this.firestore, `schools/${schoolId}`);

    await updateDoc(schoolRef, {
      enabled: true,
      updatedAt: new Date().toISOString(),
    });
  }

  async addSchool(newSchool: NewSchool): Promise<void> {
    try {
      const schoolId = doc(collection(this.firestore, 'schools')).id;

      const schoolRef = doc(this.firestore, `schools/${schoolId}`);

      await setDoc(schoolRef, {
        schoolId,
        name: newSchool.name,
        description: newSchool.description || '',
        cue: newSchool.cue,
        province: newSchool.province,
        locality: newSchool.locality,
        address: newSchool.address,
        contact: newSchool.contact || '',
        phone: newSchool.phone || '',
        email: newSchool.email || '',

        createdAt: new Date().toISOString(),
        enabled: newSchool.enabled,
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(this.errorHandler.handleFirebaseError(error));
      } else {
        this.errorHandler.log(error);
        throw new Error('Error desconocido al crear el recurso.');
      }
    }
  }

  async updateSchoolData(
    schoolId: string,
    updatedData: Partial<School>
  ): Promise<void> {
    const schoolRef = doc(this.firestore, `schools/${schoolId}`);

    try {
      await updateDoc(schoolRef, updatedData);
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(this.errorHandler.handleFirebaseError(error));
      } else {
        this.errorHandler.log(error);
        throw new Error('Error desconocido al actualizar el recurso.');
      }
    }
  }

  async deleteSchool(schoolId: string): Promise<void> {
    const schoolRef = doc(this.firestore, `schools/${schoolId}`);
    try {
      await deleteDoc(schoolRef);
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(this.errorHandler.handleFirebaseError(error));
      } else {
        this.errorHandler.log(error);
        throw new Error('Error desconocido al eliminar el recurso.');
      }
    }
  }
}
