import {
  DeviceSettingsService,
} from '../../services/device-settings.service';
import { Component, OnInit } from '@angular/core';
import { ConversionsService } from 'src/app/services/conversions.service';
import { BLUETOOTH_UUID } from 'src/app/constants/bluetooth-uuid';
import { BluetoothUtils } from 'src/app/utils/bluetooth-utils';
import { BluetoothConnectionService } from 'src/app/services/bluetooth-connection.service';

@Component({
  selector: 'app-pump-controls',
  templateUrl: './pump-controls.component.html',
  styleUrls: ['./pump-controls.component.scss'],
})
export class PumpControlsComponent implements OnInit {
  readonly device = this.deviceSettingsService.state.asReadonly();

  upper = this.deviceSettingsService.select('upperThresh');
  lower = this.deviceSettingsService.select('lowerThresh');
  thresholds = { lower: this.upper(), upper: this.lower() };

  constructor(
    private deviceSettingsService: DeviceSettingsService,
    public bluetoothConnectionService: BluetoothConnectionService
  ) {}

  ngOnInit() {
  }

  rangeChange(event: any) {
    this.deviceSettingsService.set('lowerThresh', event.detail.value.lower);
    this.deviceSettingsService.set('upperThresh', event.detail.value.upper);
    this.thresholds = { lower: this.upper(), upper: this.lower() };
    // console.log(this.device());
  }

  setDataView(num:number):DataView {
    const buffer = new ArrayBuffer(4);
    const dataView = new DataView(buffer);

    // Set the value of the DataView to the number 100
    dataView.setUint32(0, num, true);
    return dataView
  }



  onSaveButtonClick() {
    // console.log("save button clicked");
    const lowDataView = this.setDataView( ConversionsService.inchesToMillivolts(this.deviceSettingsService.select('lowerThresh')()));
    const highDataView = this.setDataView( ConversionsService.inchesToMillivolts(this.deviceSettingsService.select('upperThresh')()));
    const deviceID =  this.bluetoothConnectionService.deviceIDSignal();
    BluetoothUtils.onWriteDataWithoutResponse(deviceID, BLUETOOTH_UUID.lowThreshCharUUID, lowDataView, BLUETOOTH_UUID.pressureServiceUUID)
    BluetoothUtils.onWriteDataWithoutResponse(deviceID, BLUETOOTH_UUID.highThreshCharUUID, highDataView, BLUETOOTH_UUID.pressureServiceUUID)
  }
}
