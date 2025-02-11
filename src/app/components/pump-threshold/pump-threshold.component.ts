import {
  DeviceSettingsService,
  DeviceState,
} from '../../services/device-settings.service';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { ConversionsService } from 'src/app/services/conversions.service';
import { BLUETOOTH_UUID } from 'src/app/constants/bluetooth-uuid';

@Component({
  selector: 'app-pump-threshold',
  templateUrl: './pump-threshold.component.html',
  styleUrls: ['./pump-threshold.component.scss'],
})
export class PumpThresholdComponent  implements OnInit {
  @Input() userType!: string
  readonly device = this.deviceSettingsService.state.asReadonly();

  upper = this.deviceSettingsService.select('upperThresh');
  lower = this.deviceSettingsService.select('lowerThresh');
  thresholds = { lower: this.upper(), upper: this.lower() };

  constructor(
    private deviceSettingsService: DeviceSettingsService,
    public bluetoothService: BluetoothService
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter(){
  }

  rangeChange(event: any) {
    this.deviceSettingsService.set('lowerThresh', event.detail.value.lower);
    this.deviceSettingsService.set('upperThresh', event.detail.value.upper);
    this.thresholds = { lower: this.upper(), upper: this.lower() };
    // console.log(this.device());
  }

  singleRangeChange(event: any) {
    this.deviceSettingsService.set('upperThresh', event.detail.value.upper);
    this.thresholds = { lower: this.upper(), upper: this.lower() };
  }

  onSaveButtonClick() {
    // console.log("save button clicked");
    const lowDataView = this.bluetoothService.setUint32DataView( ConversionsService.inchesToMillivolts(this.deviceSettingsService.select('lowerThresh')()));
    const highDataView = this.bluetoothService.setUint32DataView( ConversionsService.inchesToMillivolts(this.deviceSettingsService.select('upperThresh')()));

    this.bluetoothService.onWriteDataWithoutResponse(BLUETOOTH_UUID.lowThreshCharUUID, lowDataView, BLUETOOTH_UUID.pressureServiceUUID)
    this.bluetoothService.onWriteDataWithoutResponse(BLUETOOTH_UUID.highThreshCharUUID, highDataView, BLUETOOTH_UUID.pressureServiceUUID)
  }
}
