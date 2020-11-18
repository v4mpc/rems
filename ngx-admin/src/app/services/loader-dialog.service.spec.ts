import { TestBed } from '@angular/core/testing';

import { LoaderDialogService } from './loader-dialog.service';

describe('LoaderDialogService', () => {
  let service: LoaderDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
