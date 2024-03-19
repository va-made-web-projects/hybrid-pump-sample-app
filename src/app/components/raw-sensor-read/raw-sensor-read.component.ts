import { Component, OnDestroy, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Subscription, take } from 'rxjs';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { PresureDataService } from 'src/app/services/pressure-data.service';

@Component({
  selector: 'app-raw-sensor-read',
  templateUrl: './raw-sensor-read.component.html',
  styleUrls: ['./raw-sensor-read.component.scss'],
})
export class RawSensorReadComponent  implements OnInit, OnDestroy {
  ngZone: any;
  isWeb = false;
  dataSub: Subscription = new Subscription;
  pressureData: number = 0;


  constructor(private dataService: PresureDataService, private bluetoothService: BluetoothService) { }

  ngOnDestroy(): void {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }

  ngOnInit() {
    if (Capacitor.getPlatform() === 'web') {
      this.isWeb = true;
    } else {
      this.ngZone.run(() => {
        this.dataService.activateDataVisual('live');
      });
    }

    this.dataSub = this.bluetoothService.notifyData.subscribe(
      data => {
        console.log(data)
        this.pressureData = data
      }
    )
  }

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
