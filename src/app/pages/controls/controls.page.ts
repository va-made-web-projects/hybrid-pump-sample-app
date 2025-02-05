import { Component, OnDestroy, OnInit } from '@angular/core';
import { numbersToDataView } from '@capacitor-community/bluetooth-le';
import { Subscription } from 'rxjs';
import { BLUETOOTH_UUID } from 'src/app/constants/bluetooth-uuid';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { ConversionsService } from 'src/app/services/conversions.service';
import { DeviceSettingsService } from 'src/app/services/device-settings.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.page.html',
  styleUrls: ['./controls.page.scss'],
})
export class ControlsPage implements OnInit, OnDestroy {
  connectionSub: Subscription = new Subscription;
  connected: boolean = true;

  constructor(
    private deviceSettingsService: DeviceSettingsService,
    private bluetoothService: BluetoothService
  ) {}

  ngOnInit() {
    this.connectionSub = this.bluetoothService.connectionData.subscribe(
      data => {
        this.connected = data
      }
    );
    // this.debug = this.bluetoothService.debug();
  }

  ngOnDestroy(): void {
      if (this.connectionSub) {
        this.connectionSub.unsubscribe();
      }
  }
}
