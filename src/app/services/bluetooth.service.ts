import { Capacitor } from '@capacitor/core';
import { Injectable, NgZone, signal } from '@angular/core';
import {BleClient} from '@capacitor-community/bluetooth-le';
import { from, Subject } from 'rxjs';
import { map} from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { BLUETOOTH_UUID } from './../constants/bluetooth-uuid';
import { ScanResult } from './../../../node_modules/@capacitor-community/bluetooth-le/dist/esm/definitions.d';
import { ConversionsService } from './conversions.service';
import { AlertService } from './alert.service';


interface BluetoothDevice {
  deviceId: string;
}

interface PageData {
  pageNumber: number;
  data: number[];
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
  connectionStatus = signal(false);
  debug = signal(false);
  currentPressureSignal = signal(0);
  alertTypeSignal = signal(0);
  errorStateSignal= signal(0);
  currentTimeSignal = signal(0);
  isConnecting = signal(true);
  totalPagesSignal = signal(0)


  constructor(
    private ngZone: NgZone, private alertService: AlertService
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
    this.isConnecting.set(true)
    try {
      BleClient.initialize().then(
        (success: any) => {
          this._bleEnabled.next(true);
        },
        (failure: any) => {
          this._bleEnabled.next(false);
        }
      );
      this.initializeBluetooth();
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
        // console.log("data", data);
        let convertedData = ConversionsService.millivoltsToInches(data)
        this.currentPressureSignal.set(convertedData);
        this._notifyData.next(convertedData);
      }
    );
  }

  async onAlertData(deviceId:string) {
    const service = BLUETOOTH_UUID.alertServiceUUID;
    const characteristic = BLUETOOTH_UUID.alertNotifyCharUUID;
    let data: number;
    await BleClient.startNotifications(
      deviceId,
      service,
      characteristic,
      (value: DataView) => {
        data = +this.parseInt8DataReading(value).toString();
        this.alertTypeSignal.set(data);
        this.alertService.presentAlert();
      }
    );
  }

  mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
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
        data = this.parseBatteryReading(value);
        // map to 2000 to 3000 to 0 - 1
        // console.log("BATTERY DATA", data);
        // data = this.mapRange(data, 2000, 2500, 0, 1);


        this.batteryLevelSignal.set(data)
        // this._notifyData.next(data);
      }
    );
  }

  parseBatteryReading(data: DataView) {
    return data.getInt32(0, true); // true for little-endian byte order
  }

  parseDataReading(data: DataView) {
    const length = data.byteLength;
    const chunkSize = 16; // Each data point is 16 bytes

    if (length % chunkSize !== 0) {
        throw new Error("Data length is not a multiple of 16 bytes.");
    }

    const parsedData = [];

    for (let offset = 0; offset < length; offset += chunkSize) {
      if (offset + 16 > length) break;
        // Read timestamp (first 8 bytes, little-endian)
        const timestamp = data.getUint32(offset, true);

        // Read sensor value (next 2 bytes, little-endian)
        const sensorValue = data.getUint16(offset + 4, true);

        // Read motor status and pump mode from byte 10
        const motorByte = data.getUint8(offset + 6);
        const isMotorRunning = (motorByte & 0x80) !== 0;
        const pumpMode = motorByte & 0x7F;

        // Read battery reading (bytes 11-12, little-endian)
        const batteryReading = data.getUint16(offset + 7, true);

        // Read low threshold (bytes 13-14, little-endian)
        const lowThreshold = data.getUint16(offset + 9, true);

        // Read high threshold (bytes 15-16, little-endian)
        const highThreshold = data.getUint16(offset + 11, true);

        parsedData.push({
            timestamp: Number(timestamp),
            sensorValue,
            isMotorRunning,
            pumpMode,
            batteryReading,
            lowThreshold,
            highThreshold
        });
    }

    return parsedData;
}

  // parseDataReading(data: DataView) {
  //   let length = data.byteLength;
  //   const data_array = new Int8Array(length / Int8Array.BYTES_PER_ELEMENT);
  //   for (let i = 0; i < data_array.length; i++) {
  //     data_array[i] = data.getInt8(i * Int8Array.BYTES_PER_ELEMENT); // true for little-endian byte order
  //   }
  //   const chunkSize = 16; // Each data point is 16 bytes

  //   if (length % chunkSize !== 0) {
  //       throw new Error("Data length is not a multiple of 16 bytes.");
  //   }

  //   const parsedData = [];

  //   for (let offset = 0; offset < length; offset += chunkSize) {
  //       // Read timestamp (first 8 bytes, little-endian)
  //       const timestamp = data.getBigUint64(offset, true);

  //       // Read sensor value (next 2 bytes, little-endian)
  //       const sensorValue = data.getUint16(offset + 8, true);

  //       // Skip the 6 bytes of padding (offset + 10 to offset + 16)
  //       parsedData.push({
  //           timestamp: Number(timestamp), // Converting BigInt to Number for ease of use
  //           sensorValue
  //       });
  //   }

  //   console.log(parsedData);

  //   return parsedData;
  // }



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
          this.connectionStatus.set(false)

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

      // console.log('BATTERY READ DATA:', readData);

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
          this.connectionStatus.set(false)

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
        // console.log('READ THRESH:', parsedReading);
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
          this.connectionStatus.set(false)

          this.onConnectDevice(this.deviceIDSignal());
        }
      }
      // If there's an error, return null
      return null;
    }
  }

  async onReadMotorRuntime() {
    try {
      const readData = await BleClient.read(
        this.deviceIDSignal(),
        BLUETOOTH_UUID.deviceServiceUUID,
        BLUETOOTH_UUID.motorRuntimeCharUUID
      );
      // console.log('READ RAW MOTOR RUNTIME:', readData);
      if (readData.byteLength > 0) {
        const parsedReading = this.parseInt32DataReading(readData);
        // console.log('READ MOTOR RUNTIME:', parsedReading);
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
          this.connectionStatus.set(false)

          this.onConnectDevice(this.deviceIDSignal());
        }
      }
      // If there's an error, return null
      return null;
    }
  }

  async onReadPumpState() {
    try {
      const readData = await BleClient.read(
        this.deviceIDSignal(),
        BLUETOOTH_UUID.pressureServiceUUID,
        BLUETOOTH_UUID.pumpStateCharUUID
      );

      if (readData.byteLength > 0) {
        const parsedReading = this.parseInt8DataReading(readData);
        this.pumpStateSignal.set(parsedReading);
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
          this.connectionStatus.set(false)

          this.onConnectDevice(this.deviceIDSignal());
        }
      }
      // If there's an error, return null
      return null;
    }
  }

  async onReadErrorState() {
    this.errorStateSignal.set(0)
    try {
      const readData = await BleClient.read(
        this.deviceIDSignal(),
        BLUETOOTH_UUID.deviceServiceUUID,
        BLUETOOTH_UUID.errorStateCharUUID
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
          this.connectionStatus.set(false)

          this.onConnectDevice(this.deviceIDSignal());
        }
      }
      // If there's an error, return null
      return null;
    }
  }

  async onWriteDataWithoutResponse(uuid: string, data: DataView, service: string) {
    try {
      await BleClient.writeWithoutResponse(
        this.deviceIDSignal(),
        service,
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
            this.onNotifyData(this.deviceIDSignal());
            this.onNotifyBatteryData(this.deviceIDSignal());
            this.onAlertData(this.deviceIDSignal());
          }
      });
  }

  async readTimestamp(): Promise<number> {
    try {
      const value = await await BleClient.read(
        this.deviceIDSignal(),
        BLUETOOTH_UUID.timeServiceUUID,
        BLUETOOTH_UUID.currentTimeCharUUID
      );
      // Assuming the timestamp is sent as a 4-byte unsigned integer
      const timestamp = value.getUint32(0, true); // true for little-endian
      this.currentTimeSignal.set(timestamp);
      // console.log('READ TIMESTAMP:', timestamp);
      return timestamp;
    } catch (error) {
      console.error('Error reading timestamp:', error);
      throw error;
    }
  }

  /**
   * Write timestamp to device
   * @param timestamp Unix timestamp to set
   */
  // Your writeTimestamp function (as given earlier)
  async writeTimestamp(timestamp: number): Promise<void> {
    try {
      // Create a buffer with the timestamp
      const buffer = new ArrayBuffer(4);
      const view = new DataView(buffer);
      view.setUint32(0, timestamp, true); // Little-endian

      // console.log('Writing timestamp:', view);

      // Assuming `this.timeCharacteristic` is initialized and ready for writing
      await this.onWriteDataWithoutResponse(BLUETOOTH_UUID.currentTimeCharUUID, view, BLUETOOTH_UUID.timeServiceUUID);

      console.log('Timestamp successfully written:', timestamp);
    } catch (error) {
      console.error('Error writing timestamp:', error);
      throw error;
    }
  }

  async readTotalPages(): Promise<number> {
    try {
      const value = await await BleClient.read(
        this.deviceIDSignal(),
        BLUETOOTH_UUID.deviceServiceUUID,
        BLUETOOTH_UUID.totalPagesCharUUID
      );
      // Assuming the timestamp is sent as a 4-byte unsigned integer
      const totalPages = value.getUint32(0, true); // true for little-endian
      this.totalPagesSignal.set(totalPages);
      // console.log('READ TotalPages:', totalPages);
      return totalPages;
    } catch (error) {
      console.error('Error reading total pages:', error);
      throw error;
    }
  }

async readWritingData(): Promise<boolean> {
    try {
      const value = await BleClient.read(
        this.deviceIDSignal(),
        BLUETOOTH_UUID.deviceServiceUUID,
        BLUETOOTH_UUID.writingDataCharUUID
      );

      // Convert ArrayBuffer to DataView and read first byte
      const dataView = new DataView(value.buffer);
      return dataView.getUint8(0) === 1;
    } catch (error) {
      console.error('Error reading Bluetooth writing data state:', error);
      return false;
    }
}

async writeWritingData(state: boolean): Promise<void> {
    try {
      // Create ArrayBuffer with DataView
      const buffer = new ArrayBuffer(1);
      const dataView = new DataView(buffer);
      dataView.setUint8(0, state ? 1 : 0);

      await BleClient.writeWithoutResponse(
        this.deviceIDSignal(),
        BLUETOOTH_UUID.deviceServiceUUID,
        BLUETOOTH_UUID.writingDataCharUUID,
        dataView
      );
    } catch (error) {
      console.error('Error writing Bluetooth writing data state:', error);
    }
}

}
