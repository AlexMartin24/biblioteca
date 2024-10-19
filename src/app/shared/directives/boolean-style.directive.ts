import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appBooleanStyle]',
})
export class BooleanStyleDirective implements OnInit, OnChanges {
  @Input('appBooleanStyle') presencial!: boolean;

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  // ngOnInit: Se utiliza para configurar el componente/directiva una vez, cuando se inicializa.
  ngOnInit(): void {
    this.renderer.setStyle(this.element.nativeElement, 'border-radius', '20px');
    this.renderer.setStyle(
      this.element.nativeElement,
      'padding',
      '5px 5px 5px 5px'
    );

    // this.renderer.setStyle(
    //     this.element.nativeElement,
    //     'background-color',
    //     this.presencial ? '#4acdf4' : '#36CD5D'
    // );

    // this.renderer.addClass(this.element.nativeElement, 'texto-verde') PARA AGREGAR UNA CLASE A LA ETIQUETA
  }

  // ngOnChanges: Se utiliza para manejar los cambios en los valores de entrada a lo largo del ciclo de vida del componente/directiva.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['presencial']) {
      // console.log('Cambio detectado:', this.presencial); // Agrega esta línea
      this.renderer.setStyle(
        this.element.nativeElement,
        'background-color',
        this.presencial ? '#4acdf4' : '#B833FF'
      );
    }
  }
}
