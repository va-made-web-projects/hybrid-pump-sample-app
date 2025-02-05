import { Component, Input, OnInit } from '@angular/core';
import { BLUETOOTH_UUID } from 'src/app/constants/bluetooth-uuid';
import { BluetoothService } from 'src/app/services/bluetooth.service';

@Component({
  selector: 'app-pump-type-control',
  templateUrl: './pump-type-control.component.html',
  styleUrls: ['./pump-type-control.component.scss'],
})
export class PumpTypeControlComponent  implements OnInit {
  @Input({ required: true }) pumpType!: string
  types: any[] = [];
  constructor(public bluetoothService: BluetoothService) { }

  user_types = [
    { value: 0, label: 'Hybrid', color: 'success' },
    { value: 1, label: 'Silent', color: 'danger' },
    // { value: 2, label: 'Diagnostic', color: 'warning' }
  ];
  admin_types = [
    { value: 0, label: 'Hybrid', color: 'success' },
    { value: 1, label: 'Silent', color: 'danger' },
    { value: 2, label: 'Diagnostic', color: 'warning' }
  ];

  setPumpState(value: number) {
    this.bluetoothService.onWriteDataWithoutResponse(BLUETOOTH_UUID.pumpStateCharUUID, this.setPumpStateDataView(value), BLUETOOTH_UUID.pressureServiceUUID)
  }


  setPumpStateDataView(num:number):DataView {
    const buffer = new ArrayBuffer(1);
    const dataView = new DataView(buffer);

    // Set the value of the DataView to the number 100
    dataView.setUint8(0, num);
    return dataView
  }

  ngOnInit() {
    if (this.pumpType === 'user') {
      this.types = this.user_types
    } else {
      this.types = this.admin_types
    }
  }
}
