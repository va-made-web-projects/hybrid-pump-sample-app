import { Injectable } from '@angular/core';
import { BluetoothService } from './bluetooth.service';

@Injectable({
  providedIn: 'root'
})
export class SpoofDataService {
  spoofInterval: any;

  constructor(private bluetoothService: BluetoothService) { }


  public startSpoofPressure() {

    if (this.spoofInterval) {
      clearInterval(this.spoofInterval);
    }

    this.bluetoothService.debug.set(true);

    // invertal at 1 second
    this.spoofInterval = setInterval(() => {
      // get random number between 0 20
      let pressure = Math.floor(Math.random() * 20);
        this.bluetoothService.currentPressureSignal.set(pressure);
    }, 1000);
  }

  public stopSpoofPressure() {
    this.bluetoothService.debug.set(false);

    if (this.spoofInterval) {
      clearInterval(this.spoofInterval);
    }
  }
}
