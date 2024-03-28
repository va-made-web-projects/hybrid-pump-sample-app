import { Injectable } from '@angular/core';
import { AppState } from '../app-state.service';

export interface DeviceState {
  type: string;
  id: string;
  isElectric: boolean;
  isSilent: boolean;
  lowerThresh: number;
  upperThresh: number;
  runtime: number;
  sn: string;
  vn: string;
}


@Injectable({
  providedIn: 'root'
})
export class DeviceSettingsService extends AppState<DeviceState> {
  constructor() {
    super();
  }
}
