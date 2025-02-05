import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlsPageRoutingModule } from './controls-routing.module';

import { ControlsPage } from './controls.page';
import { PumpControlsComponent } from '../../components/pump-controls/pump-controls.component';
import { DeviceSettingsService } from '../../services/device-settings.service';
import { BluetoothTimeComponent } from 'src/app/components/bluetooth-time/bluetooth-time.component';
import { TimeNotSyncedPopoverComponent } from 'src/app/components/time-not-synced-popover/time-not-synced-popover.component';
import { StorageUsageComponent } from 'src/app/components/storage-usage/storage-usage.component';
import { FileSizePipe } from 'src/app/pipes/filesize.pipe';
import { StartWritingComponent } from 'src/app/components/start-writing/start-writing.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ControlsPageRoutingModule
	],
	declarations: [ControlsPage,
    PumpControlsComponent,
    BluetoothTimeComponent,
    TimeNotSyncedPopoverComponent,
    StorageUsageComponent,
    FileSizePipe,
    StartWritingComponent
  ],
})
export class ControlsPageModule {}
