import { Subscription } from 'rxjs';
import { DeviceSettingsService } from '../../services/device-settings.service';
import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { BluetoothControlsService } from 'src/app/services/bluetooth-controls.service';
import { BluetoothConnectionService } from 'src/app/services/bluetooth-connection.service';
import { BluetoothNotificationService } from 'src/app/services/bluetooth-notification.service';

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
  connection = signal<boolean>(false);
  id = signal<string>('')
  currentPressure = signal<number>(0)
  currentMotorRuntime = 0

  constructor(
    private bluetoothConnectionService: BluetoothConnectionService,
    private bluetoothControlService: BluetoothControlsService,
    private bluetoothNotificationService: BluetoothNotificationService

  ) {
      this.connection = this.bluetoothConnectionService.connectionStatus;
      this.id = this.bluetoothConnectionService.deviceIDSignal
      this.currentPressure = this.bluetoothNotificationService.currentPressureSignal;

    }

  ngOnDestroy(): void {
    if (this.connectionSub) {
      this.connectionSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.connectionSub = this.bluetoothConnectionService.connectionData.subscribe(
      data => {
        this.connected = data
        // console.log("BLE CONNECTED PUMP INFO CARD!!!", this.connected)
      }
    )

    this.bluetoothControlService.onReadMotorRuntime(this.id()).then(
      data => {
        if (data) {
          this.currentMotorRuntime = data
        }
      }
    )
  }

}
