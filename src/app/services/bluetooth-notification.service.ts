import { Injectable, signal } from "@angular/core";
import { BleClient } from "@capacitor-community/bluetooth-le";
import { Subject } from "rxjs";
import { BLUETOOTH_UUID } from "../constants/bluetooth-uuid";
import { ConversionsService } from "./conversions.service";
import { AlertService } from "./alert.service";
import SensorData from "../types/sensor-type.interface";
import { ParseDataUtils } from "../utils/parse-data-utils";

// bluetooth-data.service.ts
@Injectable({
  providedIn: 'root'
})
export class BluetoothNotificationService {
  private _notifyData = new Subject<number>();
  private _recordingState = new Subject<boolean>();

  batteryLevelSignal = signal(0);
  pumpStateSignal = signal(0);
  currentPressureSignal = signal(0);
  alertTypeSignal = signal(0);
  errorStateSignal = signal(0);
  currentTimeSignal = signal(0);
  totalPagesSignal = signal(0);
  motorRunTimeLimitSignal = signal(0);
  lowThresholdSignal = signal(0);
  highThresholdSignal = signal(0);
  progress = signal(0);

  fullFlashData: SensorData[] = []
  fullFlashPages: number = 0;

  constructor(
    private alertService: AlertService) {}

  get notifyData() { return this._notifyData.asObservable(); }
  get recordingState() { return this._recordingState.asObservable(); }

  notificationInit(deviceID: string) {
    this.onNotifyData(deviceID);
    this.onNotifyBatteryData(deviceID);
    this.onAlertData(deviceID);
  }

  async onNotifyData(deviceId:string) {
    const service = BLUETOOTH_UUID.pressureServiceUUID;
    const characteristic = BLUETOOTH_UUID.notifyPressureCharUUID;
    let data: number;
    await BleClient.startNotifications(
      deviceId,
      service,
      characteristic,
      (value: DataView) => {
        data = +ParseDataUtils.parseInt16DataReading(value).toString();
        // console.log("data", data);
        let convertedData = ConversionsService.millivoltsToInches(data)
        this.currentPressureSignal.set(convertedData);
        this._notifyData.next(convertedData);
      }
    );
  }


  async onAlertData(deviceId:string) {
    const service = BLUETOOTH_UUID.alertServiceUUID;
    const characteristic = BLUETOOTH_UUID.alertNotifyCharUUID;
    let data: number;
    await BleClient.startNotifications(
      deviceId,
      service,
      characteristic,
      (value: DataView) => {
        data = +ParseDataUtils.parseInt8DataReading(value).toString();
        this.alertTypeSignal.set(data);
        this.alertService.presentAlert();
      }
    );
  }

  async onNotifyBatteryData(deviceId:string) {
    const service = BLUETOOTH_UUID.batteryServiceUUID;
    const characteristic = BLUETOOTH_UUID.batteryLevelCharUUID;
    let data: number;
    await BleClient.startNotifications(
      deviceId,
      service,
      characteristic,
      (value: DataView) => {
        data = ParseDataUtils.parseBatteryReading(value);
        // map to 2000 to 3000 to 0 - 1
        // console.log("BATTERY DATA", data);
        // data = this.mapRange(data, 2000, 2500, 0, 1);
        this.batteryLevelSignal.set(data)
        // this._notifyData.next(data);
      }
    );
  }
}
