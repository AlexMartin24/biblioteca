
export interface UserCredentials  {
    email: string;
    password: string;
}

export interface User {
    userId: string,
    nombre: string;
    apellido: string;
    tipoUsuario: 'ALUMNO' | 'PROFESOR' | 'ADMINISTRADOR';


    direccion: string;
    fechaNacimiento: Date;
    telefono: string;
    isDeleted: boolean;
    createdAt: string;
  

}




