import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PumpPageRoutingModule } from './pump-routing.module';

import { PumpPage } from './pump.page';
import { PumpInfoCardComponent } from './pump-info-card/pump-info-card.component';
import { PumpStatusComponent } from './pump-status/pump-status.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PumpPageRoutingModule
  ],
  declarations: [PumpPage, PumpInfoCardComponent, PumpStatusComponent]
})
export class PumpPageModule {}
