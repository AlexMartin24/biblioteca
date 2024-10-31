import { Component, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Alumno } from '../alumno.model';
import { ActivatedRoute } from '@angular/router';
import { AlumnosService } from '../service/alumnos.service';
import { AuthService } from '../../../auth/service/auth.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-perfil-alumno',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './perfil-alumno.component.html',
  styleUrl: './perfil-alumno.component.css',
})
export class PerfilAlumnoComponent {
  alumno$!: Alumno;
  idAlumno!: string | null; // almacenar el ID en string ya que viene como parametro
  private alumnosService = inject(AlumnosService);

  constructor(
    private route: ActivatedRoute // ActivatedRoute se usa Para acceder a los parámetros de la ruta
  ) {}

  ngOnInit(): void {
    // Recupera el idAlumno de la cadena desde la URL
    this.route.paramMap.subscribe((params) => {
      this.idAlumno = params.get('idAlumno'); // Asigna el valor a la variable idAlumno. params.get() siempre devuelve un string (o null) ya que proviene de la URL
      if (this.idAlumno) {
        console.log('---- EXISTE ID DEL ALUMNO - ---');
        // +this.idAlumno convierte el string a un número y llamamos a obtenerAlumno
        this.getUser(this.idAlumno);
      } else {
        console.log('---- NO SE ENCONTRÓ ID DEL ALUMNO - ---');
      }
    });
  }

  async getUser(idAlumno: string) {
    const alumnoData = await this.alumnosService.getUser(idAlumno);
    if (!alumnoData) {
      console.log('No se encontró el usuario');
    } else {
      // Convertir Timestamp a Date si es necesario
      if (alumnoData.fechaNacimiento instanceof Timestamp) {
        alumnoData.fechaNacimiento = alumnoData.fechaNacimiento.toDate();
      }
      this.alumno$ = alumnoData;
      console.log('Usuario encontrado:', this.alumno$);
    }
  }
}
