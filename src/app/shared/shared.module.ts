import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InfoButtonComponent } from './info-button/info-button.component';
import { InfoPopoverComponent } from './info-popover/info-popover.component';
import { UserTypeComponent } from './user-type/user-type.component';
import { FormsModule } from '@angular/forms';
import { CodeModalComponent } from './code-modal/code-modal.component';
import { ResetErrorStateComponent } from '../components/reset-error-state/reset-error-state.component';



@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule
	],
	declarations: [
    InfoButtonComponent,
    InfoPopoverComponent,
    UserTypeComponent,
    CodeModalComponent,
    ResetErrorStateComponent
  ],
	exports: [
    InfoButtonComponent,
    InfoPopoverComponent,
    UserTypeComponent,
    CodeModalComponent,
    ResetErrorStateComponent
  ]
})
export class SharedModule { }
