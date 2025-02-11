import { SharedModule } from 'src/app/shared/shared.module';
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
import { PumpControlsComponent } from 'src/app/components/pump-controls/pump-controls.component';
import { PumpThresholdComponent } from 'src/app/components/pump-threshold/pump-threshold.component';
import { PumpTypeControlComponent } from 'src/app/components/pump-type-control/pump-type-control.component';
import { StorageUsageComponent } from 'src/app/components/storage-usage/storage-usage.component';
import { FileSizePipe } from 'src/app/pipes/filesize.pipe';
import { ResetNvsComponent } from 'src/app/components/reset-nvs/reset-nvs.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    SharedModule

  ],
  declarations: [AdminPage,
    AppUsageTrackerComponent,
    BluetoothTimeComponent,
    TimeNotSyncedPopoverComponent,
    StartWritingComponent,
    LimitTimerComponent,
    PumpControlsComponent,
    StorageUsageComponent,
    PumpTypeControlComponent,
    FileSizePipe,
    PumpThresholdComponent,
    ResetNvsComponent
  ]
})
export class AdminPageModule {}
