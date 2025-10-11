export interface Resource {
  // Recursos generales
  resourceId: string; // UID del recurso (obligatorio)
  name: string; // Nombre visible (obligatorio)
  type: ResourceType; // Tipo de recurso (obligatorio)
  description?: string; // Detalles extra (opcional)
  dateAdmission: Date; // Fecha de ingreso (obligatorio)
  state?: StateResource; // Estado actual (opcional)

  // Campos de libro
  author?: string;
  isbn?: string;
  editorial?: string;
  title?: string;

  // Campos de equipo
  serialNumber?: string;
  brand?: string;
  model?: string;

  // Control de stock (para materiales múltiples, ej: kits)
  totalAmount?: number;
  availableQuantity?: number;

  // Metadatos
  schoolId: string; // Obligatorio → vínculo a la escuela
  createdAt: string; // Obligatorio → ISO date string
  enabled: boolean; // Obligatorio → si el recurso está activo o deshabilitado
}

export enum ResourceType {
  LIBRO = 'LIBRO',
  NOTEBOOK = 'NOTEBOOK',
  MATERIAL = 'MATERIAL',
  OTROS = 'OTROS',
}

export enum StateResource {
  DISPONIBLE = 'DISPONIBLE',
  NO_DISPONIBLE = 'NO DISPONIBLE',
  PRESTADO = 'PRESTADO',
  DAÑADO = 'DAÑADO',
}

export interface NewResource {
  // Recursos generales
  name: string; // Nombre visible (obligatorio)
  type: ResourceType; // Tipo de recurso (obligatorio)
  description?: string; // Detalles extra (opcional)
  dateAdmission: Date; // Fecha de ingreso (obligatorio)
  state?: StateResource; // Estado actual (opcional)

  // Campos de libro
  author?: string;
  isbn?: string;
  editorial?: string;
  title?: string;

  // Campos de equipo
  serialNumber?: string;
  brand?: string;
  model?: string;

  // Control de stock (para materiales múltiples, ej: kits)
  totalAmount?: number;
  availableQuantity?: number;

  // Metadatos
  schoolId: string; // Obligatorio → vínculo a la escuela
  createdAt: string; // Obligatorio → ISO date string
  enabled: boolean; // Obligatorio → si el recurso está activo o deshabilitado
}

export type ResourceDialogMode = 'edit' | 'create';

export interface ResourceDialogData {
  resource: Resource;
  mode: ResourceDialogMode;
}
