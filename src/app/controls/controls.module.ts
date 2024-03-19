import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlsPageRoutingModule } from './controls-routing.module';

import { ControlsPage } from './controls.page';
import { PumpControlsComponent } from './pump-controls/pump-controls.component';
import { DeviceSettingsService } from './device-settings.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlsPageRoutingModule
  ],
  declarations: [ControlsPage, PumpControlsComponent],
})
export class ControlsPageModule {}
