import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlsPageRoutingModule } from './controls-routing.module';

import { ControlsPage } from './controls.page';
import { PumpControlsComponent } from '../../components/pump-controls/pump-controls.component';
import { StorageUsageComponent } from 'src/app/components/storage-usage/storage-usage.component';
import { FileSizePipe } from 'src/app/pipes/filesize.pipe';
import { PumpTypeControlComponent } from 'src/app/components/pump-type-control/pump-type-control.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ControlsPageRoutingModule
	],
	declarations: [ControlsPage,
    PumpControlsComponent,
    StorageUsageComponent,
    PumpTypeControlComponent,
    FileSizePipe,
  ],
  exports: [
    PumpTypeControlComponent
  ]
})
export class ControlsPageModule {}
