import { BluetoothConnectionService } from './../../services/bluetooth-connection.service';
import { Component, OnInit } from '@angular/core';
import { BluetoothControlsService } from 'src/app/services/bluetooth-controls.service';

@Component({
  selector: 'app-start-writing',
  templateUrl: './start-writing.component.html',
  styleUrls: ['./start-writing.component.scss'],
})
export class StartWritingComponent  implements OnInit {

  isWriting = false;

  constructor(
    private bluetoothControlsService: BluetoothControlsService,
    private bluetoothConnectionService: BluetoothConnectionService) {}

  async ngOnInit() {
    await this.refreshWritingStatus();
  }

  async refreshWritingStatus() {
    const deviceID = this.bluetoothConnectionService.deviceIDSignal();
    this.isWriting = await this.bluetoothControlsService.readWritingData(deviceID);
  }

  async toggleWritingData() {
    const deviceID = this.bluetoothConnectionService.deviceIDSignal();
    const timestamp = new Date().getTime();
    const timestampInSeconds = Math.floor(timestamp / 1000);
    await this.bluetoothControlsService.writeTimestamp(deviceID, timestampInSeconds);

    const newState = !this.isWriting;
    await this.bluetoothControlsService.writeWritingData(deviceID, newState);
    this.isWriting = newState;
  }

}
