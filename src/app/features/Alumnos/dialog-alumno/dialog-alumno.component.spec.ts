import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAlumnoComponent } from './dialog-alumno.component';

describe('DialogAlumnoComponent', () => {
  let component: DialogAlumnoComponent;
  let fixture: ComponentFixture<DialogAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAlumnoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
