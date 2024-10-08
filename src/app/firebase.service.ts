import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { Estado } from './features/Profesor/profesor.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private db: Firestore) { } // Inyecta Firestore aquí

  //estoy probando recuperar datos de firebase, no le den bola a este service
  async obtenerEstados(): Promise<Estado[]> {
    const estadosRef = collection(this.db, 'estados');
    const snapshot = await getDocs(estadosRef);
    return snapshot.docs.map(doc => ({
      // idEstado: doc.id,
      nombre: doc.data()['nombre']
    }));
  }
}
