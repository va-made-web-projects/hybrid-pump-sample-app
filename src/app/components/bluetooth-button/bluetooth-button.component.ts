import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { PresureDataService } from 'src/app/services/pressure-data.service';

@Component({
  selector: 'app-bluetooth-button',
  templateUrl: './bluetooth-button.component.html',
  styleUrls: ['./bluetooth-button.component.scss'],
})
export class BluetoothButtonComponent  implements OnInit {


  constructor(
    private dataService: PresureDataService,
    private bluetoothService: BluetoothService) { }

  ngOnInit() {}


  async webScan() {
    this.onNewBluetooth();
    await this.dataService.initializeBluetooth()
  }

  onNewBluetooth() {
    this.bluetoothService.removeDevice();
    this.bluetoothService.deviceId.pipe(take(1))
    .subscribe(
      (deviceId) => {
      if (deviceId) {
        this.bluetoothService.disconnectDevice(deviceId);
        this.dataService.initializeBluetooth();
        setTimeout(() => {
          this.dataService.activateDataVisual('live');
        }, 1000)
      }
    })
  }

}
