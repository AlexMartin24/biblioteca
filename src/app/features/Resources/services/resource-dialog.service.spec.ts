import { TestBed } from '@angular/core/testing';

import { ResourceDialogService } from './resource-dialog.service';

describe('ResourceDialogService', () => {
  let service: ResourceDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
