import { TestBed } from '@angular/core/testing';

import { SpoofDataService } from './spoof-data.service';

describe('SpoofDataService', () => {
  let service: SpoofDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpoofDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
