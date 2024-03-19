import { TestBed } from '@angular/core/testing';

import { PressureDataService } from './pressure-data.service';

describe('PressureDataService', () => {
  let service: PressureDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PressureDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
