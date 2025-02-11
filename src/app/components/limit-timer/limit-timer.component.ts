import { BluetoothService } from 'src/app/services/bluetooth.service';
import { Component, OnInit } from '@angular/core';
import { BLUETOOTH_UUID } from 'src/app/constants/bluetooth-uuid';

@Component({
  selector: 'app-limit-timer',
  templateUrl: './limit-timer.component.html',
  styleUrls: ['./limit-timer.component.scss'],
})
export class LimitTimerComponent  implements OnInit {

  constructor(public bluetoothService: BluetoothService) { }

  ngOnInit() {
    this.bluetoothService.onReadMotorRunTimeLimit();
  }

  ionViewWillEnter(){
    console.log("ionViewWillEnter");
    this.bluetoothService.onReadMotorRunTimeLimit();
  }

  rangeChange(event: any) {
    // console.log(this.device());
    this.bluetoothService.motorRunTimeLimitSignal.set(event.detail.value);
  }

  onSaveButtonClick() {
    // console.log("save button clicked");
    const runTimeView = this.bluetoothService.setPumpStateDataView(this.bluetoothService.motorRunTimeLimitSignal());
    this.bluetoothService.onWriteDataWithoutResponse(BLUETOOTH_UUID.normalTimerCharUUID, runTimeView, BLUETOOTH_UUID.pressureServiceUUID)
  }

}
