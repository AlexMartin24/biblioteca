import { TestBed } from '@angular/core/testing';

import { SchoolDialogService } from './school-dialog.service';

describe('SchoolDialogService', () => {
  let service: SchoolDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
