import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BluetoothConnectionService } from 'src/app/services/bluetooth-connection.service';
import { BluetoothControlsService } from 'src/app/services/bluetooth-controls.service';
import { DeviceSettingsService } from 'src/app/services/device-settings.service';

@Component({
  selector: 'app-reset-error-state',
  templateUrl: './reset-error-state.component.html',
  styleUrls: ['./reset-error-state.component.scss'],
})
export class ResetErrorStateComponent  implements OnInit {

  constructor(public bluetoothControlService: BluetoothControlsService,
    private bluetoothConnectionService: BluetoothConnectionService,
    private toastController: ToastController,
    private deviceSettingsService: DeviceSettingsService
  ) { }


  ngOnInit() {}

  resetErrorStatus() {
    const deviceID = this.bluetoothConnectionService.deviceIDSignal();
    this.bluetoothControlService.onWriteErrorState(deviceID, 0);
    this.deviceSettingsService.set("error", 0);
    this.presentToast();
  }

  presentToast() {
    this.toastController.create({
      message: 'Device Error Status Reset',
      color: 'warning',
      duration: 2000,
      position: 'top'
    }).then(toast => toast.present());
  }
}
