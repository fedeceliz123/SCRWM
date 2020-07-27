import { TestBed } from '@angular/core/testing';

import { ImageIncService } from './image-inc.service';

describe('ImageIncService', () => {
  let service: ImageIncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageIncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
