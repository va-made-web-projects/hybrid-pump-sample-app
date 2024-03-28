import { Injectable } from '@angular/core';
import { DeviceSettingsService } from './device-settings.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  readonly device = this.deviceSettingsService.state.asReadonly();

  constructor(private deviceSettingsService: DeviceSettingsService) { }

  fetchDevice() {
    

  }
}
