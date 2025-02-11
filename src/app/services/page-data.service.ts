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
  isMotorRunning: boolean;
  pumpMode: number;
  batteryReading: number;
  lowThreshold: number;
  highThreshold: number;
}

@Injectable({
  providedIn: 'root'
})
export class PageDataService {
  constructor(public bluetoothService: BluetoothService) {}

  allPageData = signal<SensorData[]>([]);
  singlePageData = signal<SensorData[]>([]);

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


  async readFullFlash(): Promise<SensorData[] | null> {
    try {
      this.bluetoothService.onNotifyFlashData();
      this.bluetoothService.onReadFlashData();
      return null


      // return Array.from(this.bluetoothService.parseDataReading(readData));
    } catch (error) {
        console.error('Error reading full flash data:', error);
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

      // Read page data
      console.log(`Reading data for page ${pageNumber}`);
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
  async readMultiplePages(startPage: number, pageCount: number, concurrencyLimit = 5): Promise<SensorData[]> {
    const results: SensorData[] = [];

    for (let i = 0; i < pageCount; i += concurrencyLimit) {
      const batch = Array.from(
        {length: Math.min(concurrencyLimit, pageCount - i)},
        (_, j) => this.readPageData(startPage + i + j)
      );

      const batchResults = await Promise.all(batch);
      results.push(...batchResults.filter(page => page !== null).flat() as SensorData[]);
    }

    return results;
  }

  // async readMultiplePages(startPage: number, pageCount: number): Promise<SensorData[]> {
  //   console.log(`Reading ${pageCount} pages starting from ${startPage}`);
  //   const promises = Array.from({length: pageCount}, (_, i) =>
  //     this.readPageData(startPage + i)
  //   );

  //   const results = await Promise.all(promises);
  //   return results.filter(page => page !== null).flat() as SensorData[];
  // }

  async readSinglePage(page: number): Promise<SensorData[]> {
    const currentPage = await this.readCurrentPage();
    if (currentPage === null) {
      console.error('Could not determine current page');
      return [];
    }

    if (page > currentPage) {
      console.error('Page number is greater than current page');
      return [];
    }

    console.log(`Reading single page ${page}`);


    const pageData = await this.readPageData(page);

    const transformedData = transformTimestamps(pageData!);
    // this.singlePageData.set(transformedData);
    return transformedData;
  }

  // Read all pages from 0 to current page
  async readAllPages(): Promise<SensorData[]> {
    const currentPage = await this.readCurrentPage();
    if (currentPage === null) {
      console.error('Could not determine current page');
      return [];
    }

    const pageData: SensorData[] = [];

    for (let page = 0; page < currentPage; page++) {
      this.bluetoothService.progress.set(page / (currentPage - 1));
      console.log(`Reading page ${page}`);
      const pageContent = await this.readPageData(page);
      if (pageContent !== null) {
        pageData.push(...pageContent);
      }
    }
    const transformedData = transformTimestamps(pageData);
    this.allPageData.set(transformedData);
    return transformedData;
  }

//   async readAllFlashData(): Promise<Uint8Array | null> {
//     try {
//       const totalSize = 16 * 1024 * 1024; // 16 MB
//       const chunkSize = 240; // MTU-optimized chunk size
//       const completeData = new Uint8Array(totalSize);
//       let currentOffset = 0;

//       while (currentOffset < totalSize) {
//         const remainingBytes = totalSize - currentOffset;
//         const readSize = Math.min(chunkSize, remainingBytes);
//         // console.log(`Reading ${readSize} bytes at offset ${currentOffset}`);

//         const value = await BleClient.read(
//           this.bluetoothService.deviceIDSignal(),
//           BLUETOOTH_UUID.dataTransferServiceUUID,
//           BLUETOOTH_UUID.dataTransferCharUUID
//         );

//         const chunkData = new Uint8Array(value.buffer);
//         completeData.set(chunkData, currentOffset);

//         currentOffset += readSize;
//       }

//       return completeData;
//     } catch (error) {
//       console.error('Error reading flash data:', error);
//       return null;
//     }
//   }
}

// Function to transform timestamps (multiplying by 1000)
const transformTimestamps = (data: SensorData[]): SensorData[] => {
  // if data is all 255 remove from array
  data = data.filter((item) => item.sensorValue !== 255);
  return data.map((item) => ({
    ...item,
    timestamp: item.timestamp * 1000,
  }));
};
