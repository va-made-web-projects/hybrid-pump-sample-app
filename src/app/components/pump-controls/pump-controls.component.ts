import { SpoofDataService } from 'src/app/services/spoof-data.service';
import {
  DeviceSettingsService,
  DeviceState,
} from '../../services/device-settings.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { ConversionsService } from 'src/app/services/conversions.service';
import { BLUETOOTH_UUID } from 'src/app/constants/bluetooth-uuid';

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
    private spoofDataService: SpoofDataService,
    public bluetoothService: BluetoothService
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

    this.bluetoothService.onWriteDataWithoutResponse(BLUETOOTH_UUID.lowThreshCharUUID, lowDataView, BLUETOOTH_UUID.pressureServiceUUID)
    this.bluetoothService.onWriteDataWithoutResponse(BLUETOOTH_UUID.highThreshCharUUID, highDataView, BLUETOOTH_UUID.pressureServiceUUID)
  }
}
