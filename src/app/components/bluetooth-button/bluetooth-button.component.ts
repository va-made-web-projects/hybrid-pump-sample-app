import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { BluetoothConnectionService } from 'src/app/services/bluetooth-connection.service';

@Component({
  selector: 'app-bluetooth-button',
  templateUrl: './bluetooth-button.component.html',
  styleUrls: ['./bluetooth-button.component.scss'],
})
export class BluetoothButtonComponent  implements OnInit {


  constructor(
    private bluetoothConnectionService: BluetoothConnectionService) { }

  ngOnInit() {}


  async webScan() {
    await this.onNewBluetooth();
    await this.bluetoothConnectionService.initializeBluetooth()
  }

  onNewBluetooth() {
    this.bluetoothConnectionService.isConnecting.set(true);
    this.bluetoothConnectionService.removeDevice();
    this.bluetoothConnectionService.deviceId.pipe(take(1))
    .subscribe(
      (deviceId) => {
      if (deviceId) {
        this.bluetoothConnectionService.disconnectDevice(deviceId);
        this.bluetoothConnectionService.initializeBluetooth();
      }
    })
  }

}
