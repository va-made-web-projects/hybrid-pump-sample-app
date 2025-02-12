import { BluetoothNotificationService } from './bluetooth-notification.service';
import { Injectable, NgZone } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { Subject, from, map } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { BLUETOOTH_UUID } from './../constants/bluetooth-uuid';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BluetoothConnectionService {
  private _device = new Subject<any>();
  private _connection = new Subject<boolean>();
  private _bleEnabled = new Subject<boolean>();
  private _deviceId = new Subject<string>();
  lostPressureAlert = false;


  isReconnecting = false;
  reconnectCount = 0;
  reconnectThreshold = 5;
  statusMessage: string = "";

  deviceIDSignal = signal<string>("");
  connectionStatus = signal(false);
  isConnecting = signal(true);

  constructor(private ngZone: NgZone, private bluetoothNotificationService: BluetoothNotificationService) {
    if (Capacitor.getPlatform() !== 'web') {
      this.initialize();
    }
  }

  get bleEnabledObs() { return this._bleEnabled.asObservable(); }
  get connectionData() { return this._connection.asObservable(); }
  get deviceId() { return this._deviceId.asObservable(); }
  get device() { return this._device.asObservable(); }

  initialize() {
    this.isConnecting.set(true);
    try {
      BleClient.initialize({ androidNeverForLocation: true }).then(
        () => this._bleEnabled.next(true),
        () => this._bleEnabled.next(false)
      );
      this.initializeBluetooth();
    } catch (error) {
      console.log('BLE INITIALIZE ERROR:', error);
    }
  }

  initializeBluetooth() {
    if (!BleClient) {
      this.initialize();
    }
    this.checkBluetooth().then(
      (success) => {
        if (!success) {
          console.log('Bluetooth is not enabled, turn bluetooth on to continue');
        }
      },
      (error) => {
        console.log('Bluetooth Error', error);
      }
    );

    //---------- Bluetooth connection ----------//
    if (!this.connectionStatus()) {
      this.autoConnect()
        .pipe(
          map((id) => {
            if (id) {
              this.deviceIDSignal.set(id);
              this.onConnectDevice(id);
            } else {
              console.log('no device id, requesting device');
              this.requestDevice(); //if cannot auto connect request device
            }

          })
        )
        .subscribe()
      }

      this.connectionData.subscribe(

        (isConnected) => {
          this.isConnecting.set(false)
          if (!isConnected) {
            this.onConnectDevice(this.deviceIDSignal());
          } else {
            this.bluetoothNotificationService.notificationInit(this.deviceIDSignal());
          }
      });
  }

  stopScan() {
    try {
      BleClient.stopLEScan();
    } catch (error) {
      console.log('BLE DEINITIALIZE ERROR:', error);
    }
  }

  checkBluetooth() {
    return BleClient.isEnabled();
  }

  disconnectDevice(id: string) {
    return BleClient.disconnect(id);
  }

  removeDevice() {
    Preferences.remove({ key: 'bluetooth_device' });
  }

  requestDevice() {
    return BleClient.requestDevice({
      services: [BLUETOOTH_UUID.pressureServiceUUID, BLUETOOTH_UUID.batteryServiceUUID, BLUETOOTH_UUID.deviceServiceUUID, BLUETOOTH_UUID.alertServiceUUID, BLUETOOTH_UUID.dataServiceUUID, BLUETOOTH_UUID.dataTransferServiceUUID],
      optionalServices: [BLUETOOTH_UUID.timeServiceUUID],
    }).then((deviceId: any) => {
      console.log('DEVICE ID:', deviceId);
      this.onConnectDevice(deviceId.deviceId);
    }).catch((error: any) => {
      console.log('ERROR requestDevice():', error);
      this.isConnecting.set(false)
    }).catch((error: any) => {
      console.log('ERROR requestDevice():', error);
      this.isConnecting.set(false)
    });
  }

  autoConnect() {
    return from(Preferences.get({ key: 'bluetooth_device' })).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        return storedData.value;
      })
    );
  }

  listDevices() {
    this.setStatus('Scanning for bluetooth LE devices');
    BleClient.requestLEScan({}, (result: any) => {
      this.onDeviceDiscovered(result);
    });
    setTimeout(() => {
      BleClient.stopLEScan();
    }, 10000);
  }


  onDeviceDiscovered(device: ScanResult) {
    this.ngZone.run(() => {
      this._device.next(device);
    });
  }

  onConnectDevice(deviceId: string) {
    Preferences.set({ key: 'bluetooth_device', value: deviceId });
    this._deviceId.next(deviceId);
    this.deviceIDSignal.set(deviceId);

    if (Capacitor.getPlatform() === 'ios') {
      // need to scan device first on ios before connection
      BleClient.requestLEScan({}, (result: ScanResult) => {
        this.onDeviceDiscovered(result);
      });
      setTimeout(() => {
        BleClient.stopLEScan();
        try {
          this.tryConnect(deviceId);
        }
        catch (connError) {
          console.log('ERROR onConnectDevice():', connError);
        }
      }, 3000); //longer scan will allow great chance of finding bt device.
    }

    // call disconnect before connect to take care of any hanging connections on android
    // https://github.com/capacitor-community/bluetooth-le#connection-fails-on-android
    if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'web') {
      try {
        BleClient.disconnect(deviceId).then(
          (disconnectSuccess: any) => {this.tryConnect(deviceId);},
          (disconnectFailure: any) => {
            this._connection.next(false);
            this.connectionStatus.set(false)
          },
        );
      } catch (connError) {
        console.log('BLE CONNECTING ERROR:', connError);
        this._connection.next(false);
        this.connectionStatus.set(false)

      }
    }
  }

  tryConnect(deviceId: string) {
    //platform independent connection
    BleClient.connect(deviceId, (onDisconnect: any) => {
      this._connection.next(false);
      this.connectionStatus.set(false)

      console.log(
        'DEVICE DISCONNECTED:',
        deviceId,
        '---',
        new Date().toISOString()
      );
    }).then(
      (success: any) => {
        console.log("BLE DEVICE CONNECTED: ", deviceId)
        this.isReconnecting = false;
        this._connection.next(true);
        this.connectionStatus.set(true)
        this.reconnectCount = 0;
        this.lostPressureAlert = false;
      },
      (failure: any) => {
        console.log(
          'DEVICE CONNECTION FAILURE IN SCAN:',
          failure,
          deviceId,
          '---',
          new Date().toISOString()
        );
        this.reconnectCount += 1;
        this.onConnectDevice(deviceId); // attempt to reconnect if failure in connection
      }
    );
  }

  reconnection() {
    if (!this.isReconnecting) {
      this.isReconnecting = true;
      this._connection.next(false);
      this.connectionStatus.set(false)

      this.onConnectDevice(this.deviceIDSignal());
    }
  }

  setStatus(message: string) {
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }
}
