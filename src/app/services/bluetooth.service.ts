import { Capacitor } from '@capacitor/core';
import { Injectable, NgZone, signal } from '@angular/core';
import {BleClient} from '@capacitor-community/bluetooth-le';
import { from, Subject } from 'rxjs';
import { map} from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { BLUETOOTH_UUID } from './../constants/bluetooth-uuid';
import { ScanResult } from './../../../node_modules/@capacitor-community/bluetooth-le/dist/esm/definitions.d';


interface BluetoothDevice {
  deviceId: string;
}

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  selectedDevice: any;
  statusMessage: string = "";
  isReconnecting = false;
  reconnectCount = 0;
  reconnectThreshold = 5;
  continuousErrorReadings = 0;
  lostPressureAlert = false;
  public _deviceId = new Subject<string>();
  public _connection = new Subject<boolean>();
  public _bleEnabled = new Subject<boolean>();
  public _recordingState = new Subject<boolean>();
  private _device = new Subject<any>();
  private _mapData = new Subject<any>();
  private _notifyData = new Subject<number>();
  batteryLevelSignal = signal(0);
  deviceIDSignal = signal<string>("");
  pumpStateSignal = signal(0);


  constructor(
    private ngZone: NgZone,
  ) {
    if (Capacitor.getPlatform() !== 'web') {
      this.initialize();
    }
  }

  get bleEnabledObs() {
    return this._bleEnabled.asObservable();
  }

  get connectionData() {
    return this._connection.asObservable();
  }

  get deviceId() {
    return this._deviceId.asObservable();
  }

  get device() {
    return this._device.asObservable();
  }

  get mapData() {
    return this._mapData.asObservable();
  }

  get notifyData() {
    return this._notifyData.asObservable();
  }
  get recordingState() {
    return this._recordingState.asObservable();
  }


  /**
   * @description: initialize the bluetooth connection
   */
  initialize() {
    try {
      BleClient.initialize().then(
        (success: any) => {
          this._bleEnabled.next(true);
        },
        (failure: any) => {
          this._bleEnabled.next(false);
        }
      );
    } catch (error) {
      console.log('BLE INITIALIZE ERROR:', error);
    }
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

  requestDevice() {
    return BleClient.requestDevice({
      services: [BLUETOOTH_UUID.pressureServiceUUID, BLUETOOTH_UUID.batteryServiceUUID],
    }).then((deviceId: any) => {
      console.log('DEVICE ID:', deviceId);
      this.onConnectDevice(deviceId.deviceId);
    }).catch((error: any) => {
      console.log('ERROR requestDevice():', error);
    }).catch((error: any) => {
      console.log('ERROR requestDevice():', error);
    });
  }

  removeDevice() {
    Preferences.remove({ key: 'bluetooth_device' });
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
    /*Msg:
        Found Device
        {"device":
        {"deviceId":"B8:27:EB:E9:FA:63","name":"AwShift"},
        "localName":"AwShift",
        "rssi":-58,
        "txPower":127,
        "manufacturerData":{},
        "serviceData":{},
        "uuids":["472c4d58-ae52-11e9-a2a3-2a2ae2dbcce4"],
        "rawAdvertisement":{}}
    */
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
      }, 10000); //longer scan will allow great chance of finding bt device.
    }

    // call disconnect before connect to take care of any hanging connections on android
    // https://github.com/capacitor-community/bluetooth-le#connection-fails-on-android
    if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'web') {
      try {
        BleClient.disconnect(deviceId).then(
          (disconnectSuccess: any) => {this.tryConnect(deviceId);},
          (disconnectFailure: any) => {this._connection.next(false);}
        );
      } catch (connError) {
        console.log('BLE CONNECTING ERROR:', connError);
        this._connection.next(false);
      }
    }
  }

  tryConnect(deviceId: string) {
    //platform independent connection
    BleClient.connect(deviceId, (onDisconnect: any) => {
      this._connection.next(false);
      console.log(
        'DEVICE DISCONNECTED:',
        deviceId,
        '---',
        new Date().toISOString()
      );
    }).then(
      (success: any) => {
        this.isReconnecting = false;
        this._connection.next(true);
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

  async onNotifyData(deviceId:string) {
    const service = BLUETOOTH_UUID.pressureServiceUUID;
    const characteristic = BLUETOOTH_UUID.notifyPressureCharUUID;
    let data: number;
    await BleClient.startNotifications(
      deviceId,
      service,
      characteristic,
      (value: DataView) => {
        data = +this.parseInt16DataReading(value).toString();
        this._notifyData.next(data);
      }
    );
  }


  async onNotifyBatteryData(deviceId:string) {
    const service = BLUETOOTH_UUID.batteryServiceUUID;
    const characteristic = BLUETOOTH_UUID.batteryLevelCharUUID;
    let data: number;
    await BleClient.startNotifications(
      deviceId,
      service,
      characteristic,
      (value: DataView) => {
        data = +this.parseBatteryReading(value).toString();
        this.batteryLevelSignal.set(data / 100)
        // this._notifyData.next(data);
      }
    );
  }

  parseBatteryReading(data: DataView) {
    let length = data.byteLength;
    const mapNumbers = new Int8Array(length / Int8Array.BYTES_PER_ELEMENT);
    for (let i = 0; i < mapNumbers.length; i++) {
      mapNumbers[i] = data.getInt8(i * Int8Array.BYTES_PER_ELEMENT); // true for little-endian byte order
    }
    const numberArray = mapNumbers;
    return numberArray;
  }



  parseInt16DataReading(mapData: DataView) {
    let length = mapData.byteLength;
    const mapNumbers = new Int16Array(length / Int16Array.BYTES_PER_ELEMENT);
    for (let i = 0; i < mapNumbers.length; i++) {
      mapNumbers[i] = mapData.getInt16(i * Int32Array.BYTES_PER_ELEMENT, true); // true for little-endian byte order
    }
    const numberArray = mapNumbers;
    return numberArray;
  }
  parseInt32DataReading(mapData: DataView) {
    let length = mapData.byteLength;
    const mapNumbers = new Int32Array(length / Int32Array.BYTES_PER_ELEMENT);
    for (let i = 0; i < mapNumbers.length; i++) {
      mapNumbers[i] = mapData.getInt32(i * Int32Array.BYTES_PER_ELEMENT, true); // true for little-endian byte order
    }
    const numberArray = mapNumbers[0];
    return numberArray;
  }
  parseInt8DataReading(mapData: DataView) {
    return mapData.getInt8(0); // true for little-endian byte order
  }

  async onReadMatData(deviceId: string) {
    try {
      const readData = await BleClient.read(
        deviceId,
        BLUETOOTH_UUID.pressureServiceUUID,
        BLUETOOTH_UUID.notifyPressureCharUUID
      );

      // console.log('READ DATA:', readData);

      if (readData.byteLength > 0) {
        const parsedReading = this.parseInt16DataReading(readData);
        return parsedReading;
      } else {
        console.log('No data received from Bluetooth device.');
        return null;
      }
    } catch (error) {
      console.log('Read BT data error:', error);
      // Assert that the error is of type 'Error'
      if ((error as Error).message && (error as Error).message.includes('Not connected')) {
        if (!this.isReconnecting) {
          this.isReconnecting = true;
          this._connection.next(false);
          this.onConnectDevice(deviceId);
        }
      }
      // If there's an error, return null
      return null;
    }
  }

  async onReadBatteryLevelData(deviceId: string) {
    try {
      const readData = await BleClient.read(
        deviceId,
        BLUETOOTH_UUID.batteryServiceUUID,
        BLUETOOTH_UUID.batteryLevelCharUUID
      );

      console.log('BATTERY READ DATA:', readData);

      if (readData.byteLength > 0) {
        const parsedReading = this.parseInt16DataReading(readData);
        return parsedReading;
      } else {
        console.log('No data received from Bluetooth device.');
        return null;
      }
    } catch (error) {
      console.log('Read BT data error:', error);
      // Assert that the error is of type 'Error'
      if ((error as Error).message && (error as Error).message.includes('Not connected')) {
        if (!this.isReconnecting) {
          this.isReconnecting = true;
          this._connection.next(false);
          this.onConnectDevice(deviceId);
        }
      }
      // If there's an error, return null
      return null;
    }
  }

  async onReadThreshold(threshUUID: string) {
    try {
      const readData = await BleClient.read(
        this.deviceIDSignal(),
        BLUETOOTH_UUID.pressureServiceUUID,
        threshUUID
      );

      if (readData.byteLength > 0) {
        const parsedReading = this.parseInt32DataReading(readData);
        console.log('READ THRESH:', parsedReading);
        return parsedReading;
      } else {
        console.log('No data received from Bluetooth device.');
        return null;
      }
    } catch (error) {
      console.log('Read BT data error:', error);
      // Assert that the error is of type 'Error'
      if ((error as Error).message && (error as Error).message.includes('Not connected')) {
        if (!this.isReconnecting) {
          this.isReconnecting = true;
          this._connection.next(false);
          this.onConnectDevice(this.deviceIDSignal());
        }
      }
      // If there's an error, return null
      return null;
    }
  }

  async onReadPumpState() {
    this.pumpStateSignal.set(1)
    try {
      const readData = await BleClient.read(
        this.deviceIDSignal(),
        BLUETOOTH_UUID.pressureServiceUUID,
        BLUETOOTH_UUID.pumpStateCharUUID
      );

      if (readData.byteLength > 0) {
        const parsedReading = this.parseInt8DataReading(readData);
        return parsedReading;
      } else {
        console.log('No data received from Bluetooth device.');
        return null;
      }
    } catch (error) {
      console.log('Read BT data error:', error);
      // Assert that the error is of type 'Error'
      if ((error as Error).message && (error as Error).message.includes('Not connected')) {
        if (!this.isReconnecting) {
          this.isReconnecting = true;
          this._connection.next(false);
          this.onConnectDevice(this.deviceIDSignal());
        }
      }
      // If there's an error, return null
      return null;
    }

  }

  async onWriteDataWithoutResponse(uuid: string, data: DataView) {
    try {
      await BleClient.writeWithoutResponse(
        this.deviceIDSignal(),
        BLUETOOTH_UUID.pressureServiceUUID,
        uuid,
        data
      );
    }
    catch (error) {
        console.log('Write BT data error:', error);
    }

  }

  onDeviceDiscovered(device: ScanResult) {
    this.ngZone.run(() => {
      this._device.next(device);
    });
  }

  setStatus(message: string) {
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }
}
