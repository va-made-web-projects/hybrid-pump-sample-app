import { BluetoothConnectionService } from './../../services/bluetooth-connection.service';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SwitchPumpTypeComponent } from 'src/app/modal/switch-pump-type/switch-pump-type.component';
import { BluetoothControlsService } from 'src/app/services/bluetooth-controls.service';

@Component({
  selector: 'app-pump-status',
  templateUrl: './pump-status.component.html',
  styleUrls: ['./pump-status.component.scss'],

})
export class PumpStatusComponent  implements OnInit {
  @Input({ required: true }) pumpStatus!: string;

  constructor(
    private modalController: ModalController,
    private bluetoothControlService: BluetoothControlsService,
    private bluetoothConnectionService: BluetoothConnectionService,
  ) { }

  async openModal() {
    if (!this.pumpStatus) return
    let newPumpType = this.pumpStatus
    let newPumpNumber = 0

    if (this.pumpStatus.toLowerCase() === 'hybrid') {
      newPumpType = 'Silent'
      newPumpNumber = 1
    }
    else if (this.pumpStatus.toLowerCase() === 'silent') {
      newPumpType = 'Hybrid'
      newPumpNumber = 0
    } else {
      newPumpType = 'Hybrid'
      newPumpNumber = 0
    }
    const modal = await this.modalController.create({
      component: SwitchPumpTypeComponent,
      componentProps: {
        pumpType: newPumpType
      }
    });

    modal.present();

    const { data } = await modal.onDidDismiss();
    if (data === true) {
      console.log('OK was pressed');
      const deviceID = this.bluetoothConnectionService.deviceIDSignal()
      this.bluetoothControlService.setPumpState(deviceID, newPumpNumber)

    } else {
      console.log('Cancel was pressed');
    }
  }

  ngOnInit() {}



}
