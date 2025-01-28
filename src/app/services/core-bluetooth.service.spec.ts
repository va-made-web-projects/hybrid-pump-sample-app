import { TestBed } from '@angular/core/testing';

import { CoreBluetoothService } from './core-bluetooth.service';

describe('CoreBluetoothService', () => {
  let service: CoreBluetoothService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreBluetoothService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
