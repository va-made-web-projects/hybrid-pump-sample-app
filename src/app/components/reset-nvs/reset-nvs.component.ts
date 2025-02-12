import { BluetoothConnectionService } from './../../services/bluetooth-connection.service';
import { DeviceSettingsService } from './../../services/device-settings.service';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BluetoothControlsService } from 'src/app/services/bluetooth-controls.service';

@Component({
  selector: 'app-reset-nvs',
  templateUrl: './reset-nvs.component.html',
  styleUrls: ['./reset-nvs.component.scss'],
})
export class ResetNvsComponent  implements OnInit {

  constructor(private bluetoothControlService: BluetoothControlsService,
    private bluetoothConnectionService: BluetoothConnectionService,
    private toastController: ToastController,
    private deviceSettingsService: DeviceSettingsService) { }


  ngOnInit() {}

  public actionSheetButtons = [
    {
      text: 'Reset',
      role: 'destructive',
      data: {
        action: 'reset',
      },
      handler: () => {
        console.log('Reset clicked');
        const deviceID = this.bluetoothConnectionService.deviceIDSignal();
        this.bluetoothControlService.writeNVSResetData(deviceID, true, this.deviceSettingsService);
        this.presentToast();

      }
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
      handler: () => {
        console.log('Cancel clicked');
      }
    },
  ];

  presentToast() {
    this.toastController.create({
      message: 'NVS data reset',
      color: 'warning',
      duration: 2000,
      position: 'top'
    }).then(toast => toast.present());
  }
}
