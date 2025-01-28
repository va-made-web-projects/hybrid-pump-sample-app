import { Injectable, signal } from '@angular/core';
import { BluetoothService } from './bluetooth.service';
import { BLUETOOTH_UUID } from '../constants/bluetooth-uuid';
import { firstValueFrom } from 'rxjs';
import { BleClient } from '@capacitor-community/bluetooth-le';

interface PageData {
  pageNumber: number;
  data: number[];
}

interface SensorData {
  timestamp: number;
  sensorValue: number;
}

@Injectable({
  providedIn: 'root'
})
export class PageDataService {
  constructor(private bluetoothService: BluetoothService) {}

  progress = signal(0);
  allPageData = signal<SensorData[]>([]);

  // Read current page number from device
  async readCurrentPage(): Promise<number | null> {
    try {
      const readData = await BleClient.read(
        this.bluetoothService.deviceIDSignal(),
        BLUETOOTH_UUID.dataServiceUUID, // Adjust UUID as per your device's configuration
        BLUETOOTH_UUID.currentPageCharUUID // Add this UUID to your constants
      );

      if (readData.byteLength > 0) {
        return this.bluetoothService.parseInt32DataReading(readData);
      } else {
        console.log('No page number received from device');
        return null;
      }
    } catch (error) {
      console.error('Error reading page number:', error);
      return null;
    }
  }

  // Read data for a specific page

  async readPageData(pageNumber: number): Promise<SensorData[] | null> {
    try {
      // Write page number to set read offset

      const pageBuffer = new DataView(new ArrayBuffer(4));
      const pageOffset = pageNumber * 256;
      pageBuffer.setInt32(0, pageOffset, true); // Little-endian

      console.log(`Setting page offset to ${pageNumber}`);
      console.log(`Page offset buffer:`, pageBuffer);

      await BleClient.write(
        this.bluetoothService.deviceIDSignal(),
        BLUETOOTH_UUID.dataServiceUUID,
        BLUETOOTH_UUID.pageOffsetWriteCharUUID,
        pageBuffer
      );

      // await this.bluetoothService.onWriteDataWithoutResponse(
      //   BLUETOOTH_UUID.pageOffsetWriteCharUUID, // Add this UUID to your constants
      //   pageBuffer,
      //   BLUETOOTH_UUID.dataServiceUUID
      // );

      // Read page data
      const readData = await BleClient.read(
        this.bluetoothService.deviceIDSignal(),
        BLUETOOTH_UUID.dataServiceUUID,
        BLUETOOTH_UUID.pageDataCharUUID // Add this UUID to your constants
      );

      if (readData.byteLength > 0) {
        console.log(`Page ${pageNumber} data:`, readData);
        // Assuming 16-bit integers, adjust parsing as needed
        return Array.from(this.bluetoothService.parseDataReading(readData));
      } else {
        console.log(`No data received for page ${pageNumber}`);
        return null;
      }
    } catch (error) {
      console.error(`Error reading data for page ${pageNumber}:`, error);
      return null;
    }
  }



  // Read all pages from 0 to current page
  async readAllPages(): Promise<SensorData[]> {
    const currentPage = await this.readCurrentPage();
    if (currentPage === null) {
      console.error('Could not determine current page');
      return [];
    }

    const pageData: SensorData[] = [];

    for (let page = 0; page <= currentPage; page++) {
      this.progress.set(page / currentPage);
      console.log(`Reading page ${page}`);
      const pageContent = await this.readPageData(page);
      if (pageContent !== null) {
        pageData.push(...pageContent);
      }
    }
    this.allPageData.set(pageData);
    return pageData;
  }
}
