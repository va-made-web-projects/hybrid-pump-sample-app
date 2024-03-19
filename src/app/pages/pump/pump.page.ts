import { DeviceSettingsService } from '../../controls/device-settings.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pump',
  templateUrl: './pump.page.html',
  styleUrls: ['./pump.page.scss'],
})
export class PumpPage implements OnInit {

  type = this.deviceSettingsService.select('type');
  upper = this.deviceSettingsService.select('upperThresh');
  lower = this.deviceSettingsService.select('lowerThresh');
  readonly device = this.deviceSettingsService.state.asReadonly();

  constructor(private deviceSettingsService: DeviceSettingsService) { }

  ngOnInit() {
    // can get from preferences
    this.deviceSettingsService.setState({
      type: 'hybrid',
      isElectric: true,
      isSilent: false,
      lowerThresh: 10,
      upperThresh: 20
    });
  }

}
