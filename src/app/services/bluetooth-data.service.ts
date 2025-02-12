import { Injectable, signal } from "@angular/core";
import { BleClient } from "@capacitor-community/bluetooth-le";
import { Subject } from "rxjs";
import { BLUETOOTH_UUID } from "../constants/bluetooth-uuid";
import { ConversionsService } from "./conversions.service";
import { AlertService } from "./alert.service";
import SensorData from "../types/sensor-type.interface";

// bluetooth-data.service.ts
@Injectable({
  providedIn: 'root'
})
export class BluetoothDataService {
  totalPagesSignal = signal(0);
  progress = signal(0);

  fullFlashData: SensorData[] = []
  fullFlashPages: number = 0;

  constructor() {}

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


  async onReadFlashData(deviceId:string) {
    this.readTotalPages(deviceId);
    this.fullFlashPages = 0
    const service = BLUETOOTH_UUID.dataServiceUUID;
    const characteristic = BLUETOOTH_UUID.readFullFlashCharUUID;
    let data: number;

    await BleClient.read(
      deviceId,
      service,
      characteristic
    );
  }

  async readTotalPages(deviceId:string): Promise<number> {
    try {
      const value = await await BleClient.read(
        deviceId,
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


}
