import { TestBed } from '@angular/core/testing';

import { ProfesorCursoService } from './profesor-curso.service';

describe('ProfesorCursoService', () => {
  let service: ProfesorCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfesorCursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
