import { DeviceSettingsService, DeviceState } from '../../services/device-settings.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pump-controls',
  templateUrl: './pump-controls.component.html',
  styleUrls: ['./pump-controls.component.scss'],
})
export class PumpControlsComponent  implements OnInit {

  isElectrical = true;
  isSilent = false;

  readonly device = this.deviceSettingsService.state.asReadonly();

  upper = this.deviceSettingsService.select('upperThresh');
  lower = this.deviceSettingsService.select('lowerThresh');
  thresholds = { lower: this.upper(), upper: this.lower()};

  constructor(private deviceSettingsService: DeviceSettingsService) { }

  ngOnInit() {

  }

  onSaveButtonClick() {
    console.log("save button clicked");
  }


  rangeChange(event: any) {
    this.deviceSettingsService.set("lowerThresh", event.detail.value.lower);
    this.deviceSettingsService.set("upperThresh", event.detail.value.upper);
    this.thresholds = { lower: this.upper(), upper: this.lower()};
    console.log(this.device());
  }

  toggleElectrical(event: any) {
    this.isElectrical = event.detail.checked;
    this.isSilent = !event.detail.checked;
    if (this.isElectrical) {
      this.deviceSettingsService.set("type", 'hybrid');
    } else {
      this.deviceSettingsService.set("type", 'mechanical');
    }

  }

  toggleSilent(event: any) {
    console.log(event);
    this.isSilent = event.detail.checked;
    this.isElectrical = !event.detail.checked;
    if (this.isSilent) {
      this.deviceSettingsService.set("type", 'mechanical');
    }
    else {
      this.deviceSettingsService.set("type", 'hybrid');
    }

  }

}
