import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { PumpPageRoutingModule } from './pump-routing.module';

import { PumpPage } from './pump.page';
import { PumpInfoCardComponent } from '../../components/pump-info-card/pump-info-card.component';
import { PumpStatusComponent } from '../../components/pump-status/pump-status.component';
import { RawSensorReadComponent } from '../../components/raw-sensor-read/raw-sensor-read.component';
import { PressureGraphComponent } from 'src/app/components/pressure-graph/pressure-graph.component';
import { BaseChartDirective } from 'ng2-charts';
import { BluetoothButtonComponent } from 'src/app/components/bluetooth-button/bluetooth-button.component';
import { MillisecondsToTimePipe } from 'src/pipes/milliseconds-to-time.pipe';
import { ErrorstateComponent } from 'src/app/components/errorstate/errorstate.component';
import { BatteryLevelComponent } from 'src/app/components/battery-level/battery-level.component';
import { SwitchPumpTypeComponent } from 'src/app/modal/switch-pump-type/switch-pump-type.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PumpPageRoutingModule,
    BaseChartDirective,
    SharedModule
  ],
  declarations: [
    PumpPage,
    PumpInfoCardComponent,
    PumpStatusComponent,
    RawSensorReadComponent,
    PressureGraphComponent,
    BluetoothButtonComponent,
    MillisecondsToTimePipe,
    ErrorstateComponent,
    BatteryLevelComponent,
    SwitchPumpTypeComponent,
  ],
  providers: [MillisecondsToTimePipe],
  exports: [MillisecondsToTimePipe]

})
export class PumpPageModule {}
