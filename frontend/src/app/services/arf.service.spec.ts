import { TestBed } from '@angular/core/testing';

import { ArfService } from './arf.service';

describe('ArfService', () => {
  let service: ArfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
