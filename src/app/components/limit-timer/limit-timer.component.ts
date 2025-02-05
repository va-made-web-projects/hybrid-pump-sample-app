import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-limit-timer',
  templateUrl: './limit-timer.component.html',
  styleUrls: ['./limit-timer.component.scss'],
})
export class LimitTimerComponent  implements OnInit {

  constructor() { }
  run_time = 10;

  ngOnInit() {}

  rangeChange(event: any) {
    // console.log(this.device());
    this.run_time = event.detail.value
  }

}
