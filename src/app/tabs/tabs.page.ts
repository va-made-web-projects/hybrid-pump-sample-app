import { BluetoothConnectionService } from './../services/bluetooth-connection.service';
import { Component, ViewChild } from '@angular/core';
import { DeviceSettingsService } from '../services/device-settings.service';
import { IonTabs } from '@ionic/angular';
import { BLUETOOTH_UUID } from '../constants/bluetooth-uuid';
import { UserTypeService } from '../services/user-type.service';
import { BluetoothControlsService } from '../services/bluetooth-controls.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('tabs', { static: true }) tabs!: IonTabs;

  userType = "user";

  constructor(
    private bluetoothControlService: BluetoothControlsService,
    private bluetoothConnectionService: BluetoothConnectionService,
    private deviceSettingsService: DeviceSettingsService,
    private userTypeService: UserTypeService
  ) {
    this.userType = this.userTypeService.userType()!;
  }

  ionViewDidEnter() {
    this.tabs.ionTabsDidChange.subscribe(() => {
      this.onTabChange();
    });
  }

  onTabChange() {
    let currentTab = this.tabs.getSelected();
    // Call your function here
    console.log(`Tab changed!: ${currentTab}`);
    if (currentTab === 'admin') {
      const deviceID = this.bluetoothConnectionService.deviceIDSignal();
      this.bluetoothControlService.onReadThreshold(deviceID, BLUETOOTH_UUID.lowThreshCharUUID);
      this.bluetoothControlService.onReadThreshold(deviceID, BLUETOOTH_UUID.highThreshCharUUID);
      this.bluetoothControlService.onReadMotorRunTimeLimit(deviceID);
      this.bluetoothControlService.updateDeviceState(deviceID, this.deviceSettingsService);

    }

    this.userType = this.userTypeService.userType()!;
    this.userTypeService.userType.update
  }

}
