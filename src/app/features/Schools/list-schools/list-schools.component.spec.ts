import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSchoolsComponent } from './list-schools.component';

describe('ListSchoolsComponent', () => {
  let component: ListSchoolsComponent;
  let fixture: ComponentFixture<ListSchoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSchoolsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListSchoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
