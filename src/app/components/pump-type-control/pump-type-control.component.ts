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


  ngOnInit() {
    if (this.pumpType === 'user') {
      this.types = this.user_types
    } else {
      this.types = this.admin_types
    }
  }
}
