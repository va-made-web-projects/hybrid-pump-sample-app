import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PumpPageRoutingModule } from './pump-routing.module';

import { PumpPage } from './pump.page';
import { PumpInfoCardComponent } from '../../components/pump-info-card/pump-info-card.component';
import { PumpStatusComponent } from '../../components/pump-status/pump-status.component';
import { RawSensorReadComponent } from 'src/app/components/raw-sensor-read/raw-sensor-read.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PumpPageRoutingModule
  ],
  declarations: [PumpPage, PumpInfoCardComponent, PumpStatusComponent, RawSensorReadComponent]
})
export class PumpPageModule {}
