import { TestBed } from '@angular/core/testing';

import { PressureBluetoothService } from './pressure-bluetooth.service';

describe('PressureBluetoothService', () => {
  let service: PressureBluetoothService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PressureBluetoothService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
