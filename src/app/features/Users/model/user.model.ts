
export interface UserCredentials {
    email: string;
    password: string;
}

export interface User {
    userId: string;
    address: string;
    email: string;
    lastname: string;
    name: string;
    phone: string;
    role: 'DOCENTE' | 'ADMINISTRADOR';
    birthdate: Date;
    schooldId: string;

    photoURL?: string;
    enabled: boolean;
    createdAt: string;

}

export interface NewUser {
    address: string;
    email: string;
    lastname: string;
    name: string;
    phone: string;
    role: string;
    birthdate: Date;
    schooldId: string;

    photoURL?: string;
    enabled: boolean;
    createdAt: string;
}
