import { BluetoothConnectionService } from './../../services/bluetooth-connection.service';
import { DeviceSettingsService } from '../../services/device-settings.service';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { BluetoothControlsService } from 'src/app/services/bluetooth-controls.service';
import { BluetoothNotificationService } from 'src/app/services/bluetooth-notification.service';

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
    private bluetoothConnectionService: BluetoothConnectionService,
    public bluetoothControlService: BluetoothControlsService,
    public bluetoothNotificationService: BluetoothNotificationService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.alertSignal = this.bluetoothNotificationService.alertTypeSignal;

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
    this.isConnecting = this.bluetoothConnectionService.isConnecting;
    this.connectionSub = this.bluetoothConnectionService.connectionData.subscribe(
      data => {
        const deviceID = this.bluetoothConnectionService.deviceIDSignal()
        this.connected = data
        if (this.connected) {
          console.log("connected")
          this.bluetoothControlService.updateDeviceState(deviceID, this.deviceSettingsService);
          this.updatePumpState();
              setInterval(() => {
                this.updatePumpState();
              }, 1000)


              this.bluetoothControlService.onReadErrorState(deviceID).then(
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

  updatePumpState() {
    const deviceID = this.bluetoothConnectionService.deviceIDSignal()
    this.bluetoothControlService.onReadPumpState(deviceID).then(
      data => {
        // console.log(data)
        if (data == 0) {
         // is hybrid
         this.deviceSettingsService.set("isElectric", true);
         this.deviceSettingsService.set("isSilent", false);
         this.deviceSettingsService.set("isDiagnostic", false);
         this.deviceSettingsService.set("type", "hybrid");

        } else if (data == 1) {
          this.deviceSettingsService.set("isElectric", false);
          this.deviceSettingsService.set("isSilent", true);
          this.deviceSettingsService.set("type", "silent");
          // is not hybrid
        } else if (data == 2) {
          this.deviceSettingsService.set("isElectric", false);
          this.deviceSettingsService.set("isSilent", false);
          this.deviceSettingsService.set("type", "diagnostic");
        }
      });
  }

  ngOnDestroy(): void {
    if (this.connectionSub) {
      this.connectionSub.unsubscribe();
    }
  }
}
