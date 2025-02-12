import { ToastController } from '@ionic/angular';
import {
  DeviceSettingsService,
  DeviceState,
} from '../../services/device-settings.service';
import { Component, Input, OnInit } from '@angular/core';
import { ConversionsService } from 'src/app/services/conversions.service';
import { BLUETOOTH_UUID } from 'src/app/constants/bluetooth-uuid';
import { ParseDataUtils } from 'src/app/utils/parse-data-utils';
import { BluetoothUtils } from 'src/app/utils/bluetooth-utils';
import { BluetoothConnectionService } from 'src/app/services/bluetooth-connection.service';

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
    public bluetoothConnectionService: BluetoothConnectionService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.upper = this.deviceSettingsService.select('upperThresh');
    this.lower = this.deviceSettingsService.select('lowerThresh');
  }

  rangeChange(event: any) {
    this.deviceSettingsService.set('lowerThresh', event.detail.value.lower);
    this.deviceSettingsService.set('upperThresh', event.detail.value.upper);
    this.thresholds = { lower: this.upper(), upper: this.lower() };
    // console.log(this.device());
  }

  singleRangeChange(event: any) {
    this.deviceSettingsService.set('lowerThresh', event.detail.value.lower);
    this.thresholds = { lower: this.upper(), upper: this.lower() };

    this.presentToast();

  }

  onSaveButtonClick() {
    // console.log("save button clicked");
    const deviceID =  this.bluetoothConnectionService.deviceIDSignal();
    const lowDataView = ParseDataUtils.setUint32DataView( ConversionsService.inchesToMillivolts(this.deviceSettingsService.select('lowerThresh')()));
    const highDataView = ParseDataUtils.setUint32DataView( ConversionsService.inchesToMillivolts(this.deviceSettingsService.select('upperThresh')()));

    BluetoothUtils.onWriteDataWithoutResponse(deviceID, BLUETOOTH_UUID.lowThreshCharUUID, lowDataView, BLUETOOTH_UUID.pressureServiceUUID)
    BluetoothUtils.onWriteDataWithoutResponse(deviceID, BLUETOOTH_UUID.highThreshCharUUID, highDataView, BLUETOOTH_UUID.pressureServiceUUID)

    this.presentToast();
  }

  presentToast() {
    this.toastController.create({
      message: 'Threshold saved',
      color: 'success',
      position: 'middle',
      duration: 2000,
    }).then((toast) => {
      toast.present();
    });
  }
}
