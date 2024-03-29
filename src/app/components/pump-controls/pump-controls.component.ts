import { DeviceSettingsService, DeviceState } from '../../services/device-settings.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pump-controls',
  templateUrl: './pump-controls.component.html',
  styleUrls: ['./pump-controls.component.scss'],
})
export class PumpControlsComponent  implements OnInit {

  isElectricSignal = this.deviceSettingsService.select('isElectric');
  isSilentSignal = this.deviceSettingsService.select('isSilent');

  isElectric = true;
  isSilent = false;

  readonly device = this.deviceSettingsService.state.asReadonly();

  upper = this.deviceSettingsService.select('upperThresh');
  lower = this.deviceSettingsService.select('lowerThresh');
  thresholds = { lower: this.upper(), upper: this.lower()};

  constructor(private deviceSettingsService: DeviceSettingsService) { }

  ngOnInit() {
    this.isElectric = this.isElectricSignal();
    this.isSilent = this.isSilentSignal();


  }

  rangeChange(event: any) {
    this.deviceSettingsService.set("lowerThresh", event.detail.value.lower);
    this.deviceSettingsService.set("upperThresh", event.detail.value.upper);
    this.thresholds = { lower: this.upper(), upper: this.lower()};
    console.log(this.device());
  }

  toggleElectrical(event: any) {
    this.isElectric = event.detail.checked;
    this.isSilent = !event.detail.checked;
    if (this.isElectric) {
      this.deviceSettingsService.set("type", 'hybrid');
      this.deviceSettingsService.set("isElectric", true);
      this.deviceSettingsService.set("isSilent", false);

    } else {
      this.deviceSettingsService.set("type", 'silent');
      this.deviceSettingsService.set("isElectric", false);
      this.deviceSettingsService.set("isSilent", true);
    }

  }

  toggleSilent(event: any) {
    console.log(event);
    this.isSilent = event.detail.checked;
    this.isElectric = !event.detail.checked;
    if (this.isSilent) {
      this.deviceSettingsService.set("type", 'silent');
      this.deviceSettingsService.set("isElectric", false);
      this.deviceSettingsService.set("isSilent", true);
    }
    else {
      this.deviceSettingsService.set("type", 'hybrid');
      this.deviceSettingsService.set("isElectric", true);
      this.deviceSettingsService.set("isSilent", false);
    }

  }

}
