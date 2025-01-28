import { BluetoothService } from 'src/app/services/bluetooth.service';
import { DeviceSettingsService } from '../../services/device-settings.service';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { BLUETOOTH_UUID } from 'src/app/constants/bluetooth-uuid';
import { ConversionsService } from 'src/app/services/conversions.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-pump',
  templateUrl: './pump.page.html',
  styleUrls: ['./pump.page.scss'],
})
export class PumpPage implements OnInit, OnDestroy {

  type = this.deviceSettingsService.select('type');
  upper = this.deviceSettingsService.select('upperThresh');
  lower = this.deviceSettingsService.select('lowerThresh');
  error = this.deviceSettingsService.select('error');
  readonly device = this.deviceSettingsService.state.asReadonly();
  alertSignal = signal(0);
  debug = signal(false);
  errorState = 0;
  isConnecting = signal(false);

  connectionSub: Subscription = new Subscription;
  connected = false;

  constructor(
    private deviceSettingsService: DeviceSettingsService,
    private bluetoothService: BluetoothService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.alertSignal = this.bluetoothService.alertTypeSignal;
    this.debug = this.bluetoothService.debug;

    // can get from preferences
    this.deviceSettingsService.setState({
      type: 'hybrid',
      id: '1234',
      isElectric: true,
      isSilent: false,
      lowerThresh: 10,
      upperThresh: 20,
      runtime: 0,
      sn: "1234",
      vn: "0.0.1"
    });
    this.isConnecting = this.bluetoothService.isConnecting;
    this.connectionSub = this.bluetoothService.connectionData.subscribe(
      data => {
        this.connected = data
        if (this.connected) {
          console.log("connected")
            this.bluetoothService.onReadThreshold(BLUETOOTH_UUID.lowThreshCharUUID).then(
              data => {
                if (data) {
                  let convertedData = ConversionsService.millivoltsToInches(data)
                  this.deviceSettingsService.set("lowerThresh",convertedData);
                }
              });
              this.bluetoothService.onReadThreshold(BLUETOOTH_UUID.highThreshCharUUID).then(
                data => {
                  if (data) {
                  let convertedData = ConversionsService.millivoltsToInches(data)
                  this.deviceSettingsService.set("upperThresh",convertedData);
                }
              });
            this.bluetoothService.onReadPumpState().then(
              data => {
                console.log(data)
                if (data == 0) {
                 // is hybrid
                 this.deviceSettingsService.set("isElectric", true);
                 this.deviceSettingsService.set("isSilent", false);
                 this.deviceSettingsService.set("type", "hybrid");

                } else if (data == 1) {
                  this.deviceSettingsService.set("isElectric", false);
                  this.deviceSettingsService.set("isSilent", true);
                  this.deviceSettingsService.set("type", "silent");
                  // is not hybrid
                }
              });

              this.bluetoothService.onReadErrorState().then(
                errorState => {
                  console.log("ERROR STATE", errorState)
                    if (errorState) {
                      this.deviceSettingsService.set("error", errorState);
                      this.errorState = errorState
                      if (errorState > 0) {
                        this.alertService.presentAlert()
                      }
                    }
                }
              )
            }
        }
    )

  }

  ngOnDestroy(): void {
    if (this.connectionSub) {
      this.connectionSub.unsubscribe();
    }
  }
}
