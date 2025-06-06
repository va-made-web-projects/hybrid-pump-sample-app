import { Injectable } from '@angular/core';
import { AppState } from '../app-state.service';

export interface DeviceState {
  type: string;
  id: string;
  isElectric: boolean;
  isSilent: boolean;
  isDiagnostic: boolean;
  lowerThresh: number;
  upperThresh: number;
  runtime: number;
  sn: string;
  vn: string;
  error: number;
}


@Injectable({
  providedIn: 'root'
})
export class DeviceSettingsService extends AppState<DeviceState> {
  constructor() {
    super();
  }
}
