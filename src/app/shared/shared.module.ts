import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InfoButtonComponent } from './info-button/info-button.component';
import { InfoPopoverComponent } from './info-popover/info-popover.component';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [InfoButtonComponent, InfoPopoverComponent],
  exports: [InfoButtonComponent, InfoPopoverComponent]

})
export class SharedModule { }
