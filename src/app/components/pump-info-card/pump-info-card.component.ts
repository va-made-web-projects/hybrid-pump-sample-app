import { Subscription } from 'rxjs';
import { DeviceSettingsService } from '../../services/device-settings.service';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { MillisecondsToTimePipe } from 'src/pipes/milliseconds-to-time.pipe';

@Component({
  selector: 'app-pump-info-card',
  templateUrl: './pump-info-card.component.html',
  styleUrls: ['./pump-info-card.component.scss'],
  providers: [ DeviceSettingsService ]
})
export class PumpInfoCardComponent  implements OnInit, OnDestroy {
  @Input({ required: true }) upper!: string;
  @Input({ required: true }) lower!: string;
  connectionSub: Subscription = new Subscription;

  connected = false;
  batteryLevel = signal<number>(0);
  connection = signal<boolean>(false);
  id = signal<string>('')
  currentPressure = signal<number>(0)
  currentMotorRuntime = 0

  constructor(
    private bluetoothService: BluetoothService) {
      this.batteryLevel = this.bluetoothService.batteryLevelSignal;
      this.connection = this.bluetoothService.connectionStatus;
      this.id = this.bluetoothService.deviceIDSignal
      this.currentPressure = this.bluetoothService.currentPressureSignal;

    }

  ngOnDestroy(): void {
    if (this.connectionSub) {
      this.connectionSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.connectionSub = this.bluetoothService.connectionData.subscribe(
      data => {
        this.connected = data
        // console.log("BLE CONNECTED PUMP INFO CARD!!!", this.connected)
      }
    )

    this.bluetoothService.onReadMotorRuntime().then(
      data => {
        if (data) {
          this.currentMotorRuntime = data
        }
      }
    )
  }

}
