import { TestBed } from '@angular/core/testing';

import { ErfService } from './erf.service';

describe('ErfService', () => {
  let service: ErfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
