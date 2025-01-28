import { Subject } from 'rxjs';
import { BLUETOOTH_UUID } from './../constants/bluetooth-uuid';
import { Injectable, signal } from '@angular/core';
import { CoreBluetoothService } from './core-bluetooth.service';
import { BleClient } from '@capacitor-community/bluetooth-le';

@Injectable({
  providedIn: 'root'
})
export class TimeService extends CoreBluetoothService {
  currentTimeSignal = signal(0);
    /**
   * Read current timestamp from device
   */
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
    async writeTimestamp(timestamp: number): Promise<void> {
      try {
        // Create a buffer with the timestamp
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setUint32(0, timestamp, true); // true for little-endian

        // await this.timeCharacteristic.writeValue(buffer);
        // this.currentTime.next(timestamp);
      } catch (error) {
        console.error('Error writing timestamp:', error);
        throw error;
      }
    }

    /**
     * Handle timestamp updates from device
     */
    private handleTimeUpdate(event: Event): void {
      const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
      if (value) {
        const timestamp = value.getUint32(0, true); // true for little-endian
        // this.currentTime.next(timestamp);
      }
    }


}
