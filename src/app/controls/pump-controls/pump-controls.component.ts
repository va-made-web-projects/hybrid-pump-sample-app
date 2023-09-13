import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pump-controls',
  templateUrl: './pump-controls.component.html',
  styleUrls: ['./pump-controls.component.scss'],
})
export class PumpControlsComponent  implements OnInit {

  isElectrical = true;

  thresholds = { lower: 10, upper: 20 };

  constructor() { }

  ngOnInit() {

  }

  rangeChange(event: any) {
    console.log(event.detail.value);
    this.thresholds = { lower: event.detail.value.lower, upper: event.detail.value.upper };
  }

}
