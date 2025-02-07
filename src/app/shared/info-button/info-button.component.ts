import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { InfoPopoverComponent } from '../info-popover/info-popover.component';

@Component({
  selector: 'app-info-button',
  templateUrl: './info-button.component.html',
  styleUrls: ['./info-button.component.scss'],
})
export class InfoButtonComponent  implements OnInit {

  @Input() popoverContent: string = '';

  constructor(private popoverController: PopoverController) {}
  ngOnInit(): void {}

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: InfoPopoverComponent,
      componentProps: {
        content: this.popoverContent
      },
      event: ev,
      translucent: true
    });

    await popover.present();
  }
}
