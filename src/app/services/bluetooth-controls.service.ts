import { BluetoothConnectionService } from './bluetooth-connection.service';
import { Injectable, NgZone, signal } from '@angular/core';
import {BleClient} from '@capacitor-community/bluetooth-le';
import { BLUETOOTH_UUID } from './../constants/bluetooth-uuid';
import { DeviceSettingsService } from './device-settings.service';
import SensorData from '../types/sensor-type.interface';
import { ParseDataUtils } from '../utils/parse-data-utils';
import { BluetoothUtils } from '../utils/bluetooth-utils';
import { ConversionsService } from './conversions.service';

@Injectable({
  providedIn: 'root',
})
export class BluetoothControlsService {
  pumpStateSignal = signal(0);
  currentTimeSignal = signal(0);
  motorRunTimeLimitSignal = signal(0);
  lowThresholdSignal = signal(0);
  highThresholdSignal = signal(0);
  errorStateSignal = signal(0);


  fullFlashData: SensorData[] = []
  fullFlashPages: number = 0;

  constructor(private bluetoothConnectionService: BluetoothConnectionService) {}


  async onReadThreshold(deviceID: string, threshUUID: string) {
    try {
      const readData = await BleClient.read(
        deviceID,
        BLUETOOTH_UUID.pressureServiceUUID,
        threshUUID
      );

      if (readData.byteLength > 0) {
        const parsedReading = ParseDataUtils.parseInt32DataReading(readData);
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
        this.bluetoothConnectionService.reconnection()
      }
      // If there's an error, return null
      return null;
    }
  }

  async onReadMotorRuntime(deviceID: string) {
    try {
      const readData = await BleClient.read(
        deviceID,
        BLUETOOTH_UUID.deviceServiceUUID,
        BLUETOOTH_UUID.motorRuntimeCharUUID
      );
      // console.log('READ RAW MOTOR RUNTIME:', readData);
      if (readData.byteLength > 0) {
        const parsedReading = ParseDataUtils.parseInt32DataReading(readData);
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
        this.bluetoothConnectionService.reconnection()
      }
      // If there's an error, return null
      return null;
    }
  }

  async onReadPumpState(deviceID: string) {
    try {
      const readData = await BleClient.read(
        deviceID,
        BLUETOOTH_UUID.pressureServiceUUID,
        BLUETOOTH_UUID.pumpStateCharUUID
      );

      if (readData.byteLength > 0) {
        const parsedReading = ParseDataUtils.parseInt8DataReading(readData);
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
        this.bluetoothConnectionService.reconnection()
      }
      // If there's an error, return null
      return null;
    }
  }

  async onReadErrorState(deviceID: string) {
    try {
      const readData = await BleClient.read(
        deviceID,
        BLUETOOTH_UUID.deviceServiceUUID,
        BLUETOOTH_UUID.errorStateCharUUID
      );

      if (readData.byteLength > 0) {
        const parsedReading = ParseDataUtils.parseInt8DataReading(readData);
        this.errorStateSignal.set(parsedReading)
        return parsedReading;
      } else {
        console.log('No data received from Bluetooth device.');
        return null;
      }
    } catch (error) {
      console.log('Read BT data error:', error);
      // Assert that the error is of type 'Error'
      if ((error as Error).message && (error as Error).message.includes('Not connected')) {
        this.bluetoothConnectionService.reconnection()
      }
      // If there's an error, return null
      return null;
    }
  }


  async onWriteErrorState(deviceID: string, state: number) {
    try {
      // Create ArrayBuffer with DataView
      const buffer = new ArrayBuffer(1);
      const dataView = new DataView(buffer);
      dataView.setUint8(0, state);
      await BleClient.writeWithoutResponse(
        deviceID,
        BLUETOOTH_UUID.deviceServiceUUID,
        BLUETOOTH_UUID.errorStateCharUUID,
        dataView
      );
      this.errorStateSignal.set(state)
    } catch (error) {
      console.log('Write BT Error State data error:', error);
    }
  }

  async onWriteDataWithoutResponse(deviceID: string, uuid: string, data: DataView, service: string) {
    try {
      await BleClient.writeWithoutResponse(
        deviceID,
        service,
        uuid,
        data
      );
    }
    catch (error) {
        console.log('Write BT data error:', error);
    }

  }

  async readTimestamp(deviceID: string): Promise<number> {
    try {
      const value = await await BleClient.read(
        deviceID,
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
  async writeTimestamp(deviceID: string, timestamp: number): Promise<void> {
    try {
      // Create a buffer with the timestamp
      const buffer = new ArrayBuffer(4);
      const view = new DataView(buffer);
      view.setUint32(0, timestamp, true); // Little-endian

      // console.log('Writing timestamp:', view);

      // Assuming `this.timeCharacteristic` is initialized and ready for writing
      await BluetoothUtils.onWriteDataWithoutResponse(deviceID, BLUETOOTH_UUID.currentTimeCharUUID, view, BLUETOOTH_UUID.timeServiceUUID);

      console.log('Timestamp successfully written:', timestamp);
    } catch (error) {
      console.error('Error writing timestamp:', error);
      throw error;
    }
  }

async readWritingData(deviceID: string): Promise<boolean> {
    try {
      const value = await BleClient.read(
        deviceID,
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

async writeWritingData(deviceID: string, state: boolean): Promise<void> {
    try {
      // Create ArrayBuffer with DataView
      const buffer = new ArrayBuffer(1);
      const dataView = new DataView(buffer);
      dataView.setUint8(0, state ? 1 : 0);

      await BleClient.writeWithoutResponse(
        deviceID,
        BLUETOOTH_UUID.deviceServiceUUID,
        BLUETOOTH_UUID.writingDataCharUUID,
        dataView
      );
    } catch (error) {
      console.error('Error writing Bluetooth writing data state:', error);
    }
}
async writeNVSResetData(deviceID: string, state: boolean, deviceSettingsService: DeviceSettingsService): Promise<void> {
    try {
      // Create ArrayBuffer with DataView
      const buffer = new ArrayBuffer(1);
      const dataView = new DataView(buffer);
      dataView.setUint8(0, state ? 1 : 0);

      await BleClient.writeWithoutResponse(
        deviceID,
        BLUETOOTH_UUID.deviceServiceUUID,
        BLUETOOTH_UUID.resetNVSDataCharUUID,
        dataView
      );
    } catch (error) {
      console.error('Error writing Bluetooth NVS Reset data state:', error);
    }
    this.updateDeviceState(deviceID, deviceSettingsService)
}

updateDeviceState(deviceID: string, deviceSettingsService: DeviceSettingsService) {
  this.onReadThreshold(deviceID, BLUETOOTH_UUID.lowThreshCharUUID).then(
    data => {
      if (data) {
        let convertedData = ConversionsService.millivoltsToInches(data)
        deviceSettingsService.set("lowerThresh",convertedData);
      }
    });
    this.onReadThreshold(deviceID, BLUETOOTH_UUID.highThreshCharUUID).then(
      data => {
        if (data) {
        let convertedData = ConversionsService.millivoltsToInches(data)
        deviceSettingsService.set("upperThresh",convertedData);
      }
    });
}


setUint32DataView(num:number):DataView {
  const buffer = new ArrayBuffer(4);
  const dataView = new DataView(buffer);

  // Set the value of the DataView to the number 100
  dataView.setUint32(0, num, true);
  return dataView
}

  setPumpState(deviceID: string, value: number) {
    this.onWriteDataWithoutResponse(deviceID, BLUETOOTH_UUID.pumpStateCharUUID, ParseDataUtils.setPumpStateDataView(value), BLUETOOTH_UUID.pressureServiceUUID)
  }

  async onReadMotorRunTimeLimit(deviceID: string) {
      try {
        const readData = await BleClient.read(
          deviceID,
          BLUETOOTH_UUID.pressureServiceUUID,
          BLUETOOTH_UUID.normalTimerCharUUID
        );

        if (readData.byteLength > 0) {
          const parsedReading = ParseDataUtils.parseInt8DataReading(readData);
          this.motorRunTimeLimitSignal.set(parsedReading);
          return parsedReading;
        } else {
          console.log('No data received from Bluetooth device.');
          return null;
        }
      } catch (error) {
        console.log('Read BT data error:', error);
        // Assert that the error is of type 'Error'
        if ((error as Error).message && (error as Error).message.includes('Not connected')) {
          this.bluetoothConnectionService.reconnection()
        }
        // If there's an error, return null
        return null;
      }
    }
}
