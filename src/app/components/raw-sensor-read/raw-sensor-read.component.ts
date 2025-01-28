import { Component, NgZone, OnDestroy, OnInit, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Subscription, take } from 'rxjs';
import { BluetoothService } from 'src/app/services/bluetooth.service';

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
    public bluetoothService: BluetoothService) {
     }

  ngOnDestroy(): void {
  }

  ngOnInit() {
  }
}
