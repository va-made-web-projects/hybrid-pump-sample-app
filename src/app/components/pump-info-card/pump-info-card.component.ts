import { Subscription } from 'rxjs';
import { DeviceSettingsService } from '../../services/device-settings.service';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { BluetoothService } from 'src/app/services/bluetooth.service';

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

  constructor(
    private bluetoothService: BluetoothService) {
      this.batteryLevel = this.bluetoothService.batteryLevelSignal;
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
      }
    )
  }

}
