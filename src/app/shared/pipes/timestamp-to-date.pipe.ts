import { Pipe, PipeTransform } from '@angular/core'; // Importa las clases necesarias para definir un pipe
import { Timestamp } from 'firebase/firestore'; // Importa Timestamp de Firebase Firestore

@Pipe({
  name: 'timestampToDate', // Nombre del pipe que se usará en las plantillas
})
export class TimestampToDatePipe implements PipeTransform {
  // Método que transforma el valor recibido en un formato de fecha
  transform(value: any): Date | null {
    if (value instanceof Timestamp) {
      return value.toDate();
    }
    return value; // Si no es un Timestamp, retornamos el valor original
  }
}
