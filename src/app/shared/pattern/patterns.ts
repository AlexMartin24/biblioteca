// ^[a-zA-Z0-9._%+-]+: Permite letras, números y algunos caracteres especiales en la parte local del correo.
// @[a-zA-Z0-9.-]+: Permite letras, números, puntos y guiones en el dominio.
// \\.[a-zA-Z]{2,}: Asegura que haya un punto seguido de al menos dos letras (por ejemplo, .com, .org, etc.).
// (\\.[a-zA-Z]{2})?$: Opcionalmente permite un segundo dominio (como .co.uk).

export const regexMail: string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(\\.[a-zA-Z]{2})?$";

// pattern solo texto
export const regexTextos: string = '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ.\\- ]{1,50}$';

// pattern texto y numeros
export const regexDireccion: string = '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9.\\- ]{1,50}$';

// pattern solo numero
export const regexNumeros: string = '^[0-9]{10}$';

