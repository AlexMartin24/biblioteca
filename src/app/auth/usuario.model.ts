
export interface Usuario {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    tipo: string;

    additionalData?: {
        fechaNacimiento: Date;
        telefono: string;
        direccion: string;
        nacionalidad: string;
    }
}


