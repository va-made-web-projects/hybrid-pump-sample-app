import { Capacitor } from '@capacitor/core';
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { BluetoothService } from '../services/bluetooth.service';

@Injectable({
  providedIn: 'root'
})
export class PresureDataService implements OnDestroy{
  deviceId: any;
  intervalId: any;
  dataSub: Subscription  = new Subscription;
  connectionSub: Subscription  = new Subscription;

  pressureData: number = 0;

  isConnected: boolean = false;
  bluetoothIdSub: Subscription = new Subscription;
  samplesPerSecond: number = 10;
  dataLength: number = 2;

  constructor(
    private bluetoothService: BluetoothService,
    ){
      if (Capacitor.getPlatform() !== 'web') {
        this.initializeBluetooth();
      }
    }

  initializeBluetooth() {
    if (!BleClient) {
      this.bluetoothService.initialize();
    }
    this.bluetoothService.checkBluetooth().then(
      (success) => {
        if (!success) {
          console.log('Bluetooth is not enabled, turn bluetooth on to continue');
        }
      },
      (error) => {
        console.log('Bluetooth Error', error);
      }
    );

    //---------- Bluetooth connection ----------//
    if (!this.isConnected) {
      this.bluetoothService
        .autoConnect()
        .pipe(
          map((id) => {
            this.deviceId = id;
            return id;
          }),
          map((id) => {
            if (id) {
              this.bluetoothService.onConnectDevice(id);
            } else {
              console.log('no device id, requesting device');
              this.bluetoothService.requestDevice(); //if cannot auto connect request device
            }
          })
        )
        .subscribe();
      }

      this.connectionSub = this.bluetoothService.connectionData.subscribe(
        (isConnected) => {
          this.isConnected = isConnected;
          if (!isConnected) {
            this.bluetoothService.onConnectDevice(this.deviceId);
          }
      });
  }

  ngOnDestroy(): void {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
    if (this.connectionSub) {
      this.connectionSub.unsubscribe();
    }
    if (this.bluetoothIdSub) {
      this.bluetoothIdSub.unsubscribe();
    }
  }

  async getBluetoothData() {

    // if no device connected return
    if (!this.deviceId) {
      //TODO: hard coded for empty 16 x 16 grid
      return 0;
    }

    try {
      // Read Bluetooth Data
      const success = await this.bluetoothService.onReadMatData(this.deviceId);
      if (success && success.length > 0) {
        const data = success;
        console.log("BLE Data:", success);
        return data;
      } else {
        console.log('no data');
        return [];
      }
    } catch (error) {
      console.error('BT read error', error);
      return 0;
    }
  }

  async activateDataVisual(viewId: string) {
    try {
      await this.bluetoothService.deviceId.pipe(take(1)).subscribe((id) => {
        this.deviceId = id;
      });
      if (this.connectionSub) {
        this.connectionSub.unsubscribe();
      }
      clearInterval(this.intervalId);
      let count = 0;
      let dataIndex = 0;

      this.connectionSub = this.bluetoothService.connectionData.subscribe(
        (isConnected) => {
          this.isConnected = isConnected;
          if (!isConnected) {
            clearInterval(this.intervalId);
          }
        });

      // start notify control command
      await this.bluetoothService.onNotifyData(this.deviceId);
      await this.bluetoothService.onNotifyBatteryData(this.deviceId);

      // this.intervalId = setInterval(async () => {
      //   count++;

      //   await this.getBluetoothData();
      //   dataIndex++;

      // }, 1000 / this.samplesPerSecond);
    } catch (error) {
      console.error('Error in activateMapVisual', error);
    }
  }
}
