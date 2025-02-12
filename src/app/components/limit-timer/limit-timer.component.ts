import { BluetoothUtils } from './../../utils/bluetooth-utils';
import { Component, OnInit } from '@angular/core';
import { BLUETOOTH_UUID } from 'src/app/constants/bluetooth-uuid';
import { BluetoothControlsService } from 'src/app/services/bluetooth-controls.service';
import { BluetoothConnectionService } from 'src/app/services/bluetooth-connection.service';
import { ParseDataUtils } from 'src/app/utils/parse-data-utils';

@Component({
  selector: 'app-limit-timer',
  templateUrl: './limit-timer.component.html',
  styleUrls: ['./limit-timer.component.scss'],
})
export class LimitTimerComponent  implements OnInit {

  constructor(public bluetoothControlsService: BluetoothControlsService,
    private bluetoothConnectionService: BluetoothConnectionService,
  ) { }

  readMotor() {
    const deviceID = this.bluetoothConnectionService.deviceIDSignal();
    this.bluetoothControlsService.onReadMotorRunTimeLimit(deviceID);
  }

  ngOnInit() {
    this.readMotor();
  }

  ionViewWillEnter(){
    console.log("ionViewWillEnter");
    this.readMotor();
  }

  rangeChange(event: any) {
    // console.log(this.device());
    this.bluetoothControlsService.motorRunTimeLimitSignal.set(event.detail.value);
  }

  onSaveButtonClick() {
    // console.log("save button clicked");
    const runTimeView = ParseDataUtils.setPumpStateDataView(this.bluetoothControlsService.motorRunTimeLimitSignal());
    const deviceID = this.bluetoothConnectionService.deviceIDSignal();
    BluetoothUtils.onWriteDataWithoutResponse(deviceID, BLUETOOTH_UUID.normalTimerCharUUID, runTimeView, BLUETOOTH_UUID.pressureServiceUUID)
  }

}
