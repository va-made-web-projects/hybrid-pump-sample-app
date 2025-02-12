import { Component, OnInit } from '@angular/core';
import { BluetoothConnectionService } from 'src/app/services/bluetooth-connection.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(public bluetoothConnectionService: BluetoothConnectionService) { }

  ngOnInit() {
  }

}
