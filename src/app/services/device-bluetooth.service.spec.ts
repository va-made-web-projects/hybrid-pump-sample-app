import { TestBed } from '@angular/core/testing';

import { DeviceBluetoothService } from './device-bluetooth.service';

describe('DeviceBluetoothService', () => {
  let service: DeviceBluetoothService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceBluetoothService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
