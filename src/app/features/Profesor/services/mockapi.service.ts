import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom, map, of, throwError } from 'rxjs';
import { Profesor } from '../profesor.model';

@Injectable({
  providedIn: 'root'
})
export class MockapiService {
  mockApi = 'https://66ec23f62b6cf2b89c5d632e.mockapi.io/';

  constructor(private http: HttpClient) {
    
   }


   obtenerProfesor(): Promise<Profesor[]> { 
    return firstValueFrom(this.http.get<Profesor[]>(`${this.mockApi}/Profesores`).pipe(
      map((data: Profesor[]) => data || []), // Asegúrate de retornar un arreglo vacío si data es undefined
      catchError((error: any) => {
        console.error('Error al obtener los estudios:', error);
        return of([]); // Retorna un arreglo vacío en caso de error
      })
    ));
  }
      
}
