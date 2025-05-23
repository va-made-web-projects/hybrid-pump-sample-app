import { BluetoothConnectionService } from './../../services/bluetooth-connection.service';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { TimeNotSyncedPopoverComponent } from '../time-not-synced-popover/time-not-synced-popover.component';
import { BluetoothControlsService } from 'src/app/services/bluetooth-controls.service';


@Component({
  selector: 'app-bluetooth-time',
  templateUrl: './bluetooth-time.component.html',
  styleUrls: ['./bluetooth-time.component.scss'],
})
export class BluetoothTimeComponent implements OnInit {
  currentTime: Date = new Date();
  bluetoothTime: Date | null = null;
  timeDifference: number = 0;
  isTimeSynced: boolean = true;

  constructor(
    private bluetoothControlsService: BluetoothControlsService,
    private bluetoothConnectionService: BluetoothConnectionService,
    private toastController: ToastController,
    private popoverController: PopoverController) {}

  ngOnInit() {
    this.updateCurrentTime();
  }

  updateCurrentTime() {
    setInterval(() => {
      this.currentTime = new Date(new Date().getTime() / 1000);
      // console.log('Current time:', this.currentTime.getTime() * 1000);
      this.currentTime = new Date(this.currentTime.getTime() * 1000);
    }, 1000);
  }

  checkTimeDifference() {
    if (this.bluetoothTime) {
      this.timeDifference = Math.abs((this.currentTime.getTime()) - this.bluetoothTime.getTime());
      this.isTimeSynced = this.timeDifference <= 10000; // 10 seconds in milliseconds
    }
  }

  updateBluetoothTime() {
    if (this.bluetoothTime) {
      this.bluetoothTime = new Date(this.bluetoothTime.getTime() + 1000);
      this.checkTimeDifference();
    }
  }

  async onReadTime(event: any) {
    try {
      // Replace with your actual service UUID and characteristic UUID
      const deviceID = this.bluetoothConnectionService.deviceIDSignal();
      const data = await this.bluetoothControlsService.readTimestamp(deviceID);
      this.bluetoothTime = new Date(new Date(data).getTime() * 1000);
      this.checkTimeDifference();
      if (!this.isTimeSynced) {
        this.openSyncPopover(event);
      }
      // update bluetooth time with each second
      this.updateBluetoothTime();
    } catch (error) {
      this.showToast('Failed to read time from Bluetooth device.');
    }
  }

  async onWriteTime() {
    try {
      const timestamp = new Date().getTime();
      const timestampInSeconds = Math.floor(timestamp / 1000);
      const deviceID = this.bluetoothConnectionService.deviceIDSignal();

      await this.bluetoothControlsService.writeTimestamp(deviceID, timestampInSeconds);
      this.showToast('Time successfully written to Bluetooth device.');
    } catch (error) {
      this.showToast('Failed to write time to Bluetooth device.');
    }
    this.onReadTime(event);
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async openSyncPopover(ev: any) {
    if (!this.isTimeSynced) {
      const popover = await this.popoverController.create({
        component: TimeNotSyncedPopoverComponent, // Create a separate component for the popover content
        event: ev,
        translucent: true,
      });
      await popover.present();
    }
  }
}
