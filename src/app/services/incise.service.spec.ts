import { TestBed } from '@angular/core/testing';

import { InciseService } from './incise.service';

describe('InciseService', () => {
  let service: InciseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InciseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
