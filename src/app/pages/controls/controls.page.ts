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
  upper = this.deviceSettingsService.select('upperThresh');
  lower = this.deviceSettingsService.select('lowerThresh');
  thresholds = { lower: this.upper(), upper: this.lower() };
  connectionSub: Subscription = new Subscription;
  connected: boolean = true;
  
  debug: boolean = false;

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
    this.debug = this.bluetoothService.debug();
  }

  ngOnDestroy(): void {
      if (this.connectionSub) {
        this.connectionSub.unsubscribe();
      }
  }

  setDataView(num:number):DataView {
    const buffer = new ArrayBuffer(4);
    const dataView = new DataView(buffer);

    // Set the value of the DataView to the number 100
    dataView.setUint32(0, num, true);
    return dataView
  }

  setPumpStateDataView(num:number):DataView {
    const buffer = new ArrayBuffer(1);
    const dataView = new DataView(buffer);

    // Set the value of the DataView to the number 100
    dataView.setUint8(0, num);
    return dataView
  }



  onSaveButtonClick() {
    console.log("save button clicked");
    const lowDataView = this.setDataView( ConversionsService.inchesToMillivolts(this.deviceSettingsService.select('lowerThresh')()));
    const highDataView = this.setDataView( ConversionsService.inchesToMillivolts(this.deviceSettingsService.select('upperThresh')()));
    const type = this.deviceSettingsService.select('type')();

    this.bluetoothService.onWriteDataWithoutResponse(BLUETOOTH_UUID.lowThreshCharUUID, lowDataView, BLUETOOTH_UUID.pressureServiceUUID)
    this.bluetoothService.onWriteDataWithoutResponse(BLUETOOTH_UUID.highThreshCharUUID, highDataView, BLUETOOTH_UUID.pressureServiceUUID)

    let pumpState = 0;
    if (type == 'silent') {
      pumpState = 1;
    } else if (type == 'hybrid') {
      pumpState = 0;
    } else if (type == 'diagnostic') {
      pumpState = 2;
    }
    this.bluetoothService.onWriteDataWithoutResponse(BLUETOOTH_UUID.pumpStateCharUUID, this.setPumpStateDataView(pumpState), BLUETOOTH_UUID.pressureServiceUUID)

  }

}
