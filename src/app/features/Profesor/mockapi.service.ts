import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Profesor } from './profesor.model';

@Injectable({
  providedIn: 'root'
})
export class MockapiService {
  mockApi = 'https://66ec23f62b6cf2b89c5d632e.mockapi.io/';

  constructor(private http: HttpClient) {
    
   }


   obtenerProfesor(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(`${this.mockApi}/Profesores`).pipe(
      catchError((error: any) => {
        console.error('Error al obtener los estudios:', error);
        return throwError('Error al obtener los estudios');
      })
    );
  }

}
