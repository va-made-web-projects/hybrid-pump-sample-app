import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { BluetoothService } from 'src/app/services/bluetooth.service';

@Component({
  selector: 'app-bluetooth-button',
  templateUrl: './bluetooth-button.component.html',
  styleUrls: ['./bluetooth-button.component.scss'],
})
export class BluetoothButtonComponent  implements OnInit {


  constructor(
    private bluetoothService: BluetoothService) { }

  ngOnInit() {}


  async webScan() {
    await this.onNewBluetooth();
    await this.bluetoothService.initializeBluetooth()
  }

  onNewBluetooth() {
    this.bluetoothService.isConnecting.set(true);
    this.bluetoothService.removeDevice();
    this.bluetoothService.deviceId.pipe(take(1))
    .subscribe(
      (deviceId) => {
      if (deviceId) {
        this.bluetoothService.disconnectDevice(deviceId);
        this.bluetoothService.initializeBluetooth();
      }
    })
  }

}
