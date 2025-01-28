import { Signal } from '@angular/core';
// core-bluetooth.service.ts
import { Capacitor } from '@capacitor/core';
import { Injectable, NgZone } from '@angular/core';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { Subject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { BLUETOOTH_UUID } from './../constants/bluetooth-uuid';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CoreBluetoothService {
  deviceIdSignal = signal<string>('');
  connectionSignal = signal<boolean>(false);
  bleEnabledSignal = signal<boolean>(false);
  deviceSignal = signal<any>({});

  statusMessage: string = "";
  isReconnecting = false;
  reconnectCount = 0;
  reconnectThreshold = 5;

  connectionStatus = signal(false);
  deviceIDSignal = signal<string>("");

  constructor(private ngZone: NgZone) {
    if (Capacitor.getPlatform() !== 'web') {
      this.initialize();
    }
  }

  // Observables

  initialize() {
    try {
      BleClient.initialize().then(
        () => this.bleEnabledSignal.set(true),
        () => this.bleEnabledSignal.set(false)
      );
    } catch (error) {
      console.log('BLE INITIALIZE ERROR:', error);
    }
  }

  stopScan() {
    try {
      BleClient.stopLEScan();
    } catch (error) {
      console.log('BLE STOP SCAN ERROR:', error);
    }
  }

  checkBluetooth() {
    return BleClient.isEnabled();
  }

  disconnectDevice(id: string) {
    return BleClient.disconnect(id);
  }

  requestDevice() {
    return BleClient.requestDevice({
      services: [
        BLUETOOTH_UUID.pressureServiceUUID,
        BLUETOOTH_UUID.batteryServiceUUID,
        BLUETOOTH_UUID.deviceServiceUUID,
        BLUETOOTH_UUID.alertServiceUUID,
        BLUETOOTH_UUID.dataServiceUUID
      ],
    }).then((deviceId: any) => {
      this.onConnectDevice(deviceId.deviceId);
    }).catch((error: any) => {
      console.log('ERROR requestDevice():', error);
    });
  }

  removeDevice() {
    Preferences.remove({ key: 'bluetooth_device' });
  }

  tryConnect(deviceId: string) {
    BleClient.connect(deviceId, () => {
      this.connectionStatus.set(false);
      console.log('DEVICE DISCONNECTED:', deviceId, '---', new Date().toISOString());
    }).then(
      () => {
        this.isReconnecting = false;
        this.connectionStatus.set(true);
        this.reconnectCount = 0;
      },
      () => {
        this.reconnectCount += 1;
        this.onConnectDevice(deviceId);
      }
    );
  }

  onConnectDevice(deviceId: string) {
    Preferences.set({ key: 'bluetooth_device', value: deviceId });
    this.deviceIDSignal.set(deviceId);

    if (Capacitor.getPlatform() === 'ios') {
      this.handleIOSConnection(deviceId);
    } else {
      this.handleAndroidConnection(deviceId);
    }
  }

  private handleIOSConnection(deviceId: string) {
    BleClient.requestLEScan({}, (result: ScanResult) => {
      this.onDeviceDiscovered(result);
    });
    setTimeout(() => {
      BleClient.stopLEScan();
      try {
        this.tryConnect(deviceId);
      } catch (error) {
        console.log('iOS Connection Error:', error);
      }
    }, 3000);
  }

  private handleAndroidConnection(deviceId: string) {
    try {
      BleClient.disconnect(deviceId).then(
        () => this.tryConnect(deviceId),
        () => {
          this.connectionStatus.set(false);
        }
      );
    } catch (error) {
      console.log('Android Connection Error:', error);
      this.connectionStatus.set(false);
    }
  }

  onDeviceDiscovered(device: ScanResult) {
    this.ngZone.run(() => {
      this.deviceSignal.set(device);
    });
  }

  setStatus(message: string) {
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  // Utility methods for parsing data
  protected parseInt8DataReading(data: DataView): number {
    return data.getInt8(0);
  }

  protected parseInt16DataReading(data: DataView): Int16Array {
    const length = data.byteLength;
    const array = new Int16Array(length / Int16Array.BYTES_PER_ELEMENT);
    for (let i = 0; i < array.length; i++) {
      array[i] = data.getInt16(i * Int32Array.BYTES_PER_ELEMENT, true);
    }
    return array;
  }

  protected parseInt32DataReading(data: DataView): number {
    return data.getInt32(0, true);
  }
}
