import { ControlsPageModule } from './../controls/controls.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { AppUsageTrackerComponent } from 'src/app/components/app-usage-tracker/app-usage-tracker.component';
import { BluetoothTimeComponent } from 'src/app/components/bluetooth-time/bluetooth-time.component';
import { TimeNotSyncedPopoverComponent } from 'src/app/components/time-not-synced-popover/time-not-synced-popover.component';
import { StartWritingComponent } from 'src/app/components/start-writing/start-writing.component';
import { LimitTimerComponent } from 'src/app/components/limit-timer/limit-timer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    ControlsPageModule,

  ],
  declarations: [AdminPage,
    AppUsageTrackerComponent,
    BluetoothTimeComponent,
    TimeNotSyncedPopoverComponent,
    StartWritingComponent,
    LimitTimerComponent
  ]
})
export class AdminPageModule {}
