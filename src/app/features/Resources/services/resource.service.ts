import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewResource, Resource } from '../model/resource.model';
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

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  constructor(
    private firestore: Firestore,
    private errorHandler: ErrorHandlerService
  ) {}

  getResourcesByStatus(enabled: boolean): Observable<Resource[]> {
    const resourcesRef = collection(this.firestore, 'resources');

    return new Observable<Resource[]>((subscriber) => {
      const resourcesQuery = query(
        resourcesRef,
        where('enabled', '==', enabled)
      );

      const unsubscribe = onSnapshot(
        resourcesQuery,
        (resourceSnapshots) => {
          const resources: Resource[] = resourceSnapshots.docs.map((doc) => {
            const jsonResource = doc.data();

            if (jsonResource['dateAdmission'] instanceof Timestamp) {
              jsonResource['dateAdmission'] =
                jsonResource['dateAdmission'].toDate();
            }

            return {
              resourceId: doc.id,
              ...jsonResource,
            } as Resource;
          });

          subscriber.next(resources);
        },
        (error) => {
          subscriber.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  async disableResource(resourceId: string) {
    const resourceRef = doc(this.firestore, `resources/${resourceId}`);

    await updateDoc(resourceRef, {
      enabled: false,
      updatedAt: new Date().toISOString(),
    });
  }

  async enableResource(resourceId: string) {
    const resourceRef = doc(this.firestore, `resources/${resourceId}`);

    await updateDoc(resourceRef, {
      enabled: true,
      updatedAt: new Date().toISOString(),
    });
  }

  async addResource(newResource: NewResource): Promise<void> {
    try {
      const resourceId = doc(collection(this.firestore, 'resources')).id;

      const resourceRef = doc(this.firestore, `resources/${resourceId}`);

      await setDoc(resourceRef, {
        resourceId,
        author: newResource.author,
        brand: newResource.brand,
        dateAdmission: newResource.dateAdmission,
        description: newResource.description,
        isbn: newResource.isbn,
        name: newResource.name,
        title: newResource.title,
        editorial: newResource.editorial,
        type: newResource.type,
        state: newResource.state,
        serialNumber: newResource.serialNumber,
        totalAmount: newResource.totalAmount,
        availableQuantity: newResource.availableQuantity,
        schoolId: newResource.schoolId,
        createdAt: new Date().toISOString(),
        enabled: newResource.enabled,
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

  async updateResourceData(
    resourceId: string,
    updatedData: Partial<Resource>
  ): Promise<void> {
    const resourceRef = doc(this.firestore, `resources/${resourceId}`);

    try {
      await updateDoc(resourceRef, updatedData);
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(this.errorHandler.handleFirebaseError(error));
      } else {
        this.errorHandler.log(error);
        throw new Error('Error desconocido al actualizar el recurso.');
      }
    }
  }

  async deleteResource(resourceId: string): Promise<void> {
    const resourceRef = doc(this.firestore, `resources/${resourceId}`);
    try {
      await deleteDoc(resourceRef);
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
