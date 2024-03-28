import { BluetoothService } from 'src/app/services/bluetooth.service';
import { DeviceSettingsService } from '../../services/device-settings.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { BLUETOOTH_UUID } from 'src/app/constants/bluetooth-uuid';

@Component({
  selector: 'app-pump',
  templateUrl: './pump.page.html',
  styleUrls: ['./pump.page.scss'],
})
export class PumpPage implements OnInit, OnDestroy {

  type = this.deviceSettingsService.select('type');
  upper = this.deviceSettingsService.select('upperThresh');
  lower = this.deviceSettingsService.select('lowerThresh');
  readonly device = this.deviceSettingsService.state.asReadonly();

  connectionSub: Subscription = new Subscription;
  connected = false;

  constructor(
    private deviceSettingsService: DeviceSettingsService,
    private bluetoothService: BluetoothService
    ) { }

  ngOnInit() {

    // can get from preferences
    this.deviceSettingsService.setState({
      type: 'hybrid',
      id: '1234',
      isElectric: true,
      isSilent: false,
      lowerThresh: 10,
      upperThresh: 20,
      runtime: 0,
      sn: "1234",
      vn: "0.0.1"
    });
    this.connectionSub = this.bluetoothService.connectionData.subscribe(
      data => {
        this.connected = data
        if (this.connected) {
            this.bluetoothService.onReadThreshold(BLUETOOTH_UUID.lowThreshCharUUID).then(
              data => {
                if (data) {
                  this.deviceSettingsService.set("lowerThresh",data);
                }
              });
            this.bluetoothService.onReadThreshold(BLUETOOTH_UUID.highThreshCharUUID).then(
              data => {
                if (data) {
                  this.deviceSettingsService.set("upperThresh",data);
                }
              });
            }
        }
    )
  }

  ngOnDestroy(): void {
    if (this.connectionSub) {
      this.connectionSub.unsubscribe();
    }
  }
}
