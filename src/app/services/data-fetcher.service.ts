import { Injectable } from '@angular/core';
import { BluetoothService } from './bluetooth.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class DataFetcherService {

  constructor(private bluetoothService: BluetoothService) {}

  getData() {
    console.log("get data");
    Preferences.get({ key: 'bluetooth_device' }).then((result) => {
      console.log("result", result);
        this.bluetoothService.onReadMatData(result.value!).then
        (success => {
          console.log("success read", success);
        },
        failure => {
          console.log("failure read", failure);
        }
        );
      });
    }

  notifyData() {
    console.log("notify data");
    Preferences.get({ key: 'bluetooth_device' }).then((result) => {
      console.log("result", result);
      this.bluetoothService.onNotifyData(result.value!).then
      (success => {
        console.log("success", success);
      },
      failure => {
        console.log("failure", failure);
      }
      );
  });
}
}
