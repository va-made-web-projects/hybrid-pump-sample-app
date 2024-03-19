import { TestBed } from '@angular/core/testing';

import { DataFetcherService } from './data-fetcher.service';
import { DatePipe } from '@angular/common';

describe('DataFetcherService', () => {
  let service: DataFetcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe]
    });
    service = TestBed.inject(DataFetcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
