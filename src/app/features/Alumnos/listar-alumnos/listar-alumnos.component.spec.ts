import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAlumnosComponent } from './listar-alumnos.component';

describe('ListarAlumnosComponent', () => {
  let component: ListarAlumnosComponent;
  let fixture: ComponentFixture<ListarAlumnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAlumnosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
