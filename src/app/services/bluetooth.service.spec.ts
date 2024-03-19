import { DatePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { BluetoothService } from './bluetooth.service';

describe('BluetoothService', () => {
  let service: BluetoothService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe]
    });
    service = TestBed.inject(BluetoothService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
