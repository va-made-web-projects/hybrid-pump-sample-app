import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-switch-pump-type',
  templateUrl: './switch-pump-type.component.html',
  styleUrls: ['./switch-pump-type.component.scss'],
})
export class SwitchPumpTypeComponent  implements OnInit {
  @Input() pumpType: string = 'Silent';



  constructor(private modalController: ModalController) {}
  ngOnInit() {}

  getTitleColor(): string {
    const lowercaseTitle = this.pumpType.toLowerCase();
    return lowercaseTitle.includes('hybrid') ? 'success' :
           lowercaseTitle.includes('silent') ? 'danger' :
           'primary';
  }

  dismiss(result: boolean) {
    this.modalController.dismiss(result);
  }

}
