import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BluetoothService } from 'src/app/services/bluetooth.service';

@Component({
  selector: 'app-reset-nvs',
  templateUrl: './reset-nvs.component.html',
  styleUrls: ['./reset-nvs.component.scss'],
})
export class ResetNvsComponent  implements OnInit {

  constructor(private bluetoothService: BluetoothService, private toastController: ToastController) { }


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
        this.bluetoothService.writeNVSResetData(true);
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
