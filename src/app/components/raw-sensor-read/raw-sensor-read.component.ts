import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { BluetoothNotificationService } from 'src/app/services/bluetooth-notification.service';

@Component({
  selector: 'app-raw-sensor-read',
  templateUrl: './raw-sensor-read.component.html',
  styleUrls: ['./raw-sensor-read.component.scss'],
})
export class RawSensorReadComponent  implements OnInit, OnDestroy {
  pressureData = signal(0);
  minPressure = 0;
  maxPressure = 0;


  constructor(
    public bluetoothNotifciationService: BluetoothNotificationService) {
     }

  ngOnDestroy(): void {
  }

  ngOnInit() {
  }
}
