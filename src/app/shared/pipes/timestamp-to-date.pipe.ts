import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

@Pipe({
  name: 'timestampToDate'
})
export class TimestampToDatePipe implements PipeTransform {
  transform(timestamp: Timestamp | null): string {
    if (timestamp) {
      const date = new Date(timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000));
      return date.toISOString().split('T')[0]; // Devuelve en formato YYYY-MM-DD
    }
    return ''; // Devuelve un string vacío si no hay timestamp
  }
}
