import { TestBed } from '@angular/core/testing';

import { AppUsageService } from './app-usage.service';

describe('AppUsageService', () => {
  let service: AppUsageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppUsageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
