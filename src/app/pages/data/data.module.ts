import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataPageRoutingModule } from './data-routing.module';

import { DataPage } from './data.page';
import { DataPointComponent } from 'src/app/components/data-point/data-point.component';
import { PageDataReaderComponent } from 'src/app/components/page-data-reader/page-data-reader.component';
import { MillivoltsToInchesPipe } from "../../pipes/converter.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataPageRoutingModule,
    MillivoltsToInchesPipe
],
  declarations: [DataPage, DataPointComponent, PageDataReaderComponent]
})
export class DataPageModule {}
