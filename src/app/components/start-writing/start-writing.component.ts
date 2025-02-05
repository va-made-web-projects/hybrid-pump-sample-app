import { Component, OnInit } from '@angular/core';
import { BluetoothService } from 'src/app/services/bluetooth.service';

@Component({
  selector: 'app-start-writing',
  templateUrl: './start-writing.component.html',
  styleUrls: ['./start-writing.component.scss'],
})
export class StartWritingComponent  implements OnInit {

  isWriting = false;

  constructor(private bleService: BluetoothService) {}

  async ngOnInit() {
    await this.refreshWritingStatus();
  }

  async refreshWritingStatus() {
    this.isWriting = await this.bleService.readWritingData();
  }

  async toggleWritingData() {
    const timestamp = new Date().getTime();
    const timestampInSeconds = Math.floor(timestamp / 1000);
    await this.bleService.writeTimestamp(timestampInSeconds);

    const newState = !this.isWriting;
    await this.bleService.writeWritingData(newState);
    this.isWriting = newState;
  }

}
