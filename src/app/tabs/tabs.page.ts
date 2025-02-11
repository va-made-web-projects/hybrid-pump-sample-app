import { BluetoothService } from 'src/app/services/bluetooth.service';
import { Component, ViewChild } from '@angular/core';
import { DeviceSettingsService } from '../services/device-settings.service';
import { IonTabs } from '@ionic/angular';
import { BLUETOOTH_UUID } from '../constants/bluetooth-uuid';
import { UserTypeService } from '../services/user-type.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('tabs', { static: true }) tabs!: IonTabs;

  userType = "user";

  constructor(
    private bluetoothService: BluetoothService,
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
      this.bluetoothService.updateDeviceState(this.deviceSettingsService);
      this.bluetoothService.onReadThreshold(BLUETOOTH_UUID.lowThreshCharUUID);
      this.bluetoothService.onReadThreshold(BLUETOOTH_UUID.highThreshCharUUID);
      this.bluetoothService.onReadMotorRunTimeLimit();
    }

    this.userType = this.userTypeService.userType()!;
    this.userTypeService.userType.update
  }

}
