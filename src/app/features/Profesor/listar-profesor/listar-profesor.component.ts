import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Estado, Estudios, Profesor } from '../profesor.model';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MockapiService } from '../services/mockapi.service';
import { ProfesorService } from '../services/profesor.service';
import { FirebaseService } from '../../../firebase.service';

@Component({
  selector: 'app-listar-profesor',
  standalone: true,
  imports: [SharedModule, HttpClientModule  ],
  providers: [MockapiService], // Añadir el servicio aquí

  templateUrl: './listar-profesor.component.html',
  styleUrls: ['./listar-profesor.component.css'],
})
export class ListarProfesorComponent implements OnInit {


  // profesores!: Profesor[];
  profesores$!: Observable<Profesor[]>;
  estudios: Estudios[] = [];
  estado: Estado[] = [];
  profesor!: Profesor[];
  estados: Estado[] = [];


  constructor(
    private dialog: MatDialog,
    private profesoresService: ProfesorService,
    private router: Router,
    private mockapiService: MockapiService,
    private firebaseService: FirebaseService,

    
  ) {}

  ngOnInit(): void {
    this.obtenerProfesores();
    this.cargarEstados();
    // this.obtenerProfesor();
  }


  obtenerProfesores(){
    this.profesores$ = this.profesoresService.ObtenerProfesoresObservable();
    console.log(this.profesores$);

  }

  AgregarProfesor() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        idProfesor: 1, // Este valor podría generarse en el backend
        nombre: '',
        apellido: '',
        correo: '',
        fechaNacimiento: '',
        // especialidad: '',
        estado: '',
        estudios: '',
        cursos: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const nuevoProfesor: Profesor = {
          idProfesor: obtenerSiguienteNumero(), // No se cambia el id ya que es solo lectura
          nombre: result.nombre,
          apellido: result.apellido,
          correo: result.correo,
          fechaNacimiento: result.fechaNacimiento,
          telefono: result.telefono,
          // especialidad: result.especialidad,
          estado: result.estado,
          estudios: result.estudios || [],
          cursos: result.cursos || []
        };

        this.profesoresService.AgregarProfesor(nuevoProfesor);
        console.log('Profesor editado correctamente', result);
      }
    });
  }
  

  EditarProfesor(profesor: Profesor) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: profesor,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const editarProfesor: Profesor = {
          idProfesor: profesor.idProfesor, // No se cambia el id ya que es solo lectura
          nombre: result.nombre,
          apellido: result.apellido,
          correo: result.correo,
          fechaNacimiento: result.fechaNacimiento,
          telefono: result.telefono,
          // especialidad: result.especialidad,
          estado: result.estado,
          estudios: result.estudios,
          cursos: result.cursos
        };

        // Llama al servicio para editar el profesor
        this.profesoresService.EditarProfesor(editarProfesor);
        console.log('Profesor editado correctamente', result);
      }
    });
  }

  EliminarProfe(profesor: Profesor) {
    this.profesoresService.EliminarProfe(profesor);
  }

  trackByProfesorId(index: number, profesor: Profesor) {
    return profesor.idProfesor;
  }

  // filtrarProfe(texto:string){
  //   this.profesoresFiltrado$ = this.profesoresService.getListaFiltrada(texto)
  //   this.profesoresFiltrado$.subscribe((profesores:Profesor[])=> {
  //     if(profesores.length ==0){
  //       this.tablaVisible = false
  //     }else{
  //       this.tablaVisible = true
  //     }
  //   })

  // }

  verDetalleProfesor(idProfesor: number) {
    this.router.navigate(['/profesor/', idProfesor]);
  }

  verDetalleCurso(idCurso: number) {
    this.router.navigate(['/curso/', idCurso]);
  }



async obtenerProfesor() {
  try {
    this.profesor = await this.mockapiService.obtenerProfesor();
    console.error('Profesor recuperado:', this.profesor);
  } catch (error) {
    console.error('Error:', error);
  }
}



  async cargarEstados(): Promise<void> {
    try {
      this.estados = await this.firebaseService.obtenerEstados();
      console.log('Estados cargados:', this.estados);
    } catch (error) {
      console.error('Error al cargar estados:', error);
    }
  }



}
let ultimoNumero = 10; // Empieza antes del rango deseado
function obtenerSiguienteNumero() {
  ultimoNumero++;
  console.log(ultimoNumero);
  return ultimoNumero;
}
