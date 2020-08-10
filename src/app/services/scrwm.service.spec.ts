import { TestBed } from '@angular/core/testing';

import { ScrwmService } from './scrwm.service';

describe('ScrwmService', () => {
  let service: ScrwmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrwmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
