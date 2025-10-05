import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ResourceDialogData,
  ResourceDialogMode,
  ResourceType,
  StateResource,
} from '../../model/resource.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  regexAlfanumericoConEspacios,
  regexDireccion,
  regexNumeros,
  regexTextos,
} from '../../../../shared/pattern/patterns';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
} from '@angular/material/core';
import { CustomDateAdapter } from '../../../../shared/fecha/CustomDateAdapter';

@Component({
  selector: 'app-resource-dialog',
  standalone: true,
  imports: [SharedModule],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
  templateUrl: './resource-dialog.component.html',
  styleUrls: ['./resource-dialog.component.css'],
})
export class ResourceDialogComponent {
  editForm: FormGroup;
  mode!: ResourceDialogMode;

  // Opciones
  ResourceTypeOptions = [
    { value: ResourceType.LIBRO, label: 'Libro' },
    { value: ResourceType.NOTEBOOK, label: 'Notebook' },
    { value: ResourceType.MATERIAL, label: 'Material' },
    { value: ResourceType.OTROS, label: 'Otros' },
  ];

  StateResourceOptions = [
    { value: StateResource.DISPONIBLE, label: 'Disponible' },
    { value: StateResource.NO_DISPONIBLE, label: 'No Disponible' },
    { value: StateResource.PRESTADO, label: 'Prestado' },
    { value: StateResource.DAÑADO, label: 'Dañado' },
  ];

  // 👇 helper para usar en HTML
  get selectedType(): ResourceType {
    return this.editForm.controls['type'].value;
  }

  constructor(
    private dialogRef: MatDialogRef<ResourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResourceDialogData
  ) {
    this.mode = data.mode;
    const resource = data.resource;

    this.editForm = new FormGroup({
      // Generales
      name: new FormControl(resource.name, [
        Validators.required,
        Validators.pattern(regexAlfanumericoConEspacios),
      ]),
      type: new FormControl(resource.type || '', [Validators.required]),
      description: new FormControl(resource.description, [
        Validators.pattern(regexDireccion),
      ]),
      dateAdmission: new FormControl(resource.dateAdmission, [
        Validators.required,
      ]),
      state: new FormControl(resource.state || '', [Validators.required]),

      // Libro
      author: new FormControl(resource.author, [
        Validators.pattern(regexTextos),
      ]),
      isbn: new FormControl(resource.isbn, [
        Validators.pattern(regexAlfanumericoConEspacios),
      ]),
      editorial: new FormControl(resource.editorial, [
        Validators.pattern(regexAlfanumericoConEspacios),
      ]),
      title: new FormControl(resource.title, [
        Validators.pattern(regexAlfanumericoConEspacios),
      ]),

      // Equipo
      brand: new FormControl(resource.brand, [
        Validators.pattern(regexAlfanumericoConEspacios),
      ]),
      model: new FormControl(resource.model, [
        Validators.pattern(regexAlfanumericoConEspacios),
      ]),
      serialNumber: new FormControl(resource.serialNumber, [
        Validators.pattern(regexAlfanumericoConEspacios),
      ]),

      // Material
      totalAmount: new FormControl(resource.totalAmount, [
        Validators.pattern(regexNumeros),
      ]),
      availableQuantity: new FormControl(resource.availableQuantity, [
        Validators.pattern(regexNumeros),
      ]),
    });
  }

  sendResources() {
    if (this.editForm.valid) {
      let formData = this.editForm.value;

      // 👉 Limpiar campos según el tipo
      switch (formData.type) {
        case ResourceType.LIBRO:
          formData = {
            ...formData,
            serialNumber: null,
            brand: null,
            model: null,
            totalAmount: null,
            availableQuantity: null,
          };
          break;

        case ResourceType.NOTEBOOK:
          formData = {
            ...formData,
            author: null,
            isbn: null,
            editorial: null,
            title: null,
            totalAmount: null,
            availableQuantity: null,
          };
          break;

        case ResourceType.MATERIAL:
          formData = {
            ...formData,
            author: null,
            isbn: null,
            editorial: null,
            title: null,
            serialNumber: null,
            brand: null,
            model: null,
          };
          break;

        case ResourceType.OTROS:
          formData = {
            ...formData,
            author: null,
            isbn: null,
            editorial: null,
            title: null,
            serialNumber: null,
            brand: null,
            model: null,
            totalAmount: null,
            availableQuantity: null,
          };
          break;
      }

      this.dialogRef.close({
        ...formData,
        resourceId: this.data.resource.resourceId,
      });
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
