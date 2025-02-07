import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-info-popover',
  templateUrl: './info-popover.component.html',
  styleUrls: ['./info-popover.component.scss'],
})
export class InfoPopoverComponent  implements OnInit {

  @Input() content: string = '';

  constructor(private popoverController: PopoverController) {}
  ngOnInit(): void {
  }
}
