
export interface User {
    idUser: string;
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

export interface NewUser {
    email: string;
    name: string;
    lastname: string;
    role: string;
    birthdate: Date;
    schooldId: string;

    photoURL?: string;
    enabled: boolean;
    createdAt: string;
}
