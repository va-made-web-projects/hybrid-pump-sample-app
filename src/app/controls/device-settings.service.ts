import { Injectable } from '@angular/core';
import { AppState } from '../app-state.service';

export interface DeviceState {
  type: string;
  isElectric: boolean;
  isSilent: boolean;
  lowerThresh: number;
  upperThresh: number;
}


@Injectable({
  providedIn: 'root'
})
export class DeviceSettingsService extends AppState<DeviceState> {
  constructor() {
    super();
  }
}
