import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PumpPage } from './pump.page';

const routes: Routes = [
  {
    path: '',
    component: PumpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PumpPageRoutingModule {}
