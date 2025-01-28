// pressure-bluetooth.service.ts
import { Injectable, NgZone } from '@angular/core';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { Subject } from 'rxjs';
import { CoreBluetoothService } from './core-bluetooth.service';
import { BLUETOOTH_UUID } from './../constants/bluetooth-uuid';
import { ConversionsService } from './conversions.service';
import { AlertService } from './alert.service';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PressureBluetoothService extends CoreBluetoothService {
  currentPressureSignal = signal(0);
  alertTypeSignal = signal(0);

  constructor(private alertService: AlertService) {
    super(null as unknown as NgZone);
  }

  async onNotifyData(deviceId: string) {
    await BleClient.startNotifications(
      deviceId,
      BLUETOOTH_UUID.pressureServiceUUID,
      BLUETOOTH_UUID.notifyPressureCharUUID,
      (value: DataView) => {
        const data = +this.parseInt16DataReading(value).toString();
        const convertedData = ConversionsService.millivoltsToInches(data);
        this.currentPressureSignal.set(convertedData);
      }
    );
  }

  async onAlertData(deviceId: string) {
    await BleClient.startNotifications(
      deviceId,
      BLUETOOTH_UUID.alertServiceUUID,
      BLUETOOTH_UUID.alertNotifyCharUUID,
      (value: DataView) => {
        const data = +this.parseInt8DataReading(value).toString();
        this.alertTypeSignal.set(data);
        this.alertService.presentAlert();
      }
    );
  }

  async onReadThreshold(threshUUID: string) {
    try {
      const readData = await BleClient.read(
        this.deviceIDSignal(),
        BLUETOOTH_UUID.pressureServiceUUID,
        threshUUID
      );

      if (readData.byteLength > 0) {
        return this.parseInt32DataReading(readData);
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
