import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Alumno } from '../alumno.model';
import { ActivatedRoute } from '@angular/router';
import { AlumnosService } from '../service/alumnos.service';

@Component({
  selector: 'app-perfil-alumno',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './perfil-alumno.component.html',
  styleUrl: './perfil-alumno.component.css',
})
export class PerfilAlumnoComponent {
  alumno$: Alumno | undefined;
  idAlumno!: string | null; // almacenar el ID en string ya que viene como parametro

  constructor(
    private alumnosService: AlumnosService,
    private route: ActivatedRoute // ActivatedRoute se usa Para acceder a los parámetros de la ruta
  ) {}

  ngOnInit(): void {
    // Recupera el idAlumno de la cadena desde la URL
    this.route.paramMap.subscribe((params) => {
      this.idAlumno = params.get('idAlumno'); // Asignamos el valor a la variable idAlumno. params.get() siempre devuelve un string (o null) ya que proviene de la URL
      if (this.idAlumno) {
        console.log('---- EXISTE ID DEL ALUMNO - ---');
        // +this.idAlumno convierte el string a un número y llamamos a obtenerAlumno
        this.obtenerAlumno(this.idAlumno);
      } else {
        console.log('---- NO SE ENCONTRÓ ID DEL ALUMNO - ---');
      }
    });
  }

  //recupera datos del alumno
  obtenerAlumno(idAlumno: string): void {
    this.alumno$ = this.alumnosService.ObtenerAlumnoPorId(idAlumno);
    console.log(this.alumno$);
  }
}
