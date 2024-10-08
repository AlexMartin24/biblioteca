import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Para acceder a los parámetros de la ruta
import { Profesor } from '../profesor.model';
import { SharedModule } from '../../../shared/shared.module';
import { ProfesorService } from '../services/profesor.service';

@Component({
  selector: 'app-perfil-profesor',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './perfil-profesor.component.html',
  styleUrls: ['./perfil-profesor.component.css']
})
export class PerfilProfesorComponent implements OnInit {

  profesor$: Profesor | undefined;
  idProfesor!: string | null; // almacenar el ID en string ya que viene como parametro

  constructor(
    private profesoresService: ProfesorService,
    private route: ActivatedRoute // ActivatedRoute se usa Para acceder a los parámetros de la ruta
  ) {}

  ngOnInit(): void {
    // Recupera el idProfesor de la cadena desde la URL
    this.route.paramMap.subscribe((params) => {
      this.idProfesor = params.get('idProfesor'); // Asignamos el valor a la variable idProfesor. params.get() siempre devuelve un string (o null) ya que proviene de la URL
      if (this.idProfesor) {
        console.log('---- EXISTE ID DEL USUARIO - ---');
        // +this.idProfesor convierte el string a un número y llamamos a obtenerProfesor
        this.ObtenerProfesorPorId(+this.idProfesor);
      } else {
        console.log('---- NO SE ENCONTRÓ ID DEL USUARIO - ---');
      }
    });
  }
  
  //recupera datos del profesor 
  ObtenerProfesorPorId(idProfesor: number): void {
    this.profesor$ = this.profesoresService.ObtenerProfesorPorId(idProfesor);
    console.log(this.profesor$);
  }
}
