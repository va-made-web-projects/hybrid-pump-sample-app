// device-bluetooth.service.ts
import { Injectable } from '@angular/core';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { CoreBluetoothService } from './core-bluetooth.service';
import { BLUETOOTH_UUID } from './../constants/bluetooth-uuid';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceBluetoothService extends CoreBluetoothService {
  batteryLevelSignal = signal(0);
  pumpStateSignal = signal(0);
  errorStateSignal = signal(0);

  async onReadErrorState() {
    this.errorStateSignal.set(0);
    try {
      const readData = await BleClient.read(
        this.deviceIDSignal(),
        BLUETOOTH_UUID.deviceServiceUUID,
        BLUETOOTH_UUID.errorStateCharUUID
      );

      if (readData.byteLength > 0) {
        return this.parseInt8DataReading(readData);
      }
      return null;
    } catch (error) {
      this.handleReadError(error);
      return null;
    }
  }

  async onReadBatteryLevelData() {
    try {
      const readData = await BleClient.read(
        this.deviceIDSignal(),
        BLUETOOTH_UUID.batteryServiceUUID,
        BLUETOOTH_UUID.batteryLevelCharUUID
      );

      if (readData.byteLength > 0) {
        return this.parseInt16DataReading(readData);
      }
      return null;
    } catch (error) {
      this.handleReadError(error);
      return null;
    }
  }

  private handleReadError(error: any) {
    console.log('Read BT data error:', error);
    if ((error as Error).message?.includes('Not connected')) {
      if (!this.isReconnecting) {
        this.isReconnecting = true;
        this.connectionStatus.set(false);
        this.onConnectDevice(this.deviceIDSignal());
      }
    }
  }
}
