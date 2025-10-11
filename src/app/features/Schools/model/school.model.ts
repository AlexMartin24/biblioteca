export interface School {
  // Recursos generales
  schoolId: string; // UID del recurso (obligatorio)
  name: string; // Nombre visible (obligatorio)
  description?: string; // Detalles extra (opcional)

  cue: string; // Código Único de Establecimiento (obligatorio)
  province: string; // Provincia (obligatorio)
  locality: string; // Localidad (obligatorio)
  address: string; // Dirección de la escuela (obligatorio)

  contact?: string; // Contacto (opcional)
  phone?: string; // Teléfono de contacto (opcional)
  email?: string; // Email de contacto (opcional)

  createdAt: string; // Obligatorio → ISO date string
  enabled: boolean; // Obligatorio → si el recurso está activo o deshabilitado
}

export interface NewSchool {
  name: string; // Nombre visible (obligatorio)
  description?: string; // Detalles extra (opcional)

  cue: string; // Código Único de Establecimiento (obligatorio)
  province: string; // Provincia (obligatorio)
  locality: string; // Localidad (obligatorio)
  address: string; // Dirección de la escuela (obligatorio)

  contact?: string; // Contacto (opcional)
  phone?: string; // Teléfono de contacto (opcional)
  email?: string; // Email de contacto (opcional)

  createdAt: string; // Obligatorio → ISO date string
  enabled: boolean; // Obligatorio → si el recurso está activo o deshabilitado
}

export type SchoolDialogMode = 'edit' | 'create';

export interface SchoolDialogData {
  school: School;
  mode: SchoolDialogMode;
}
