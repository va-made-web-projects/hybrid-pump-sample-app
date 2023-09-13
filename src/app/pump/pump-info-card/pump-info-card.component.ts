import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pump-info-card',
  templateUrl: './pump-info-card.component.html',
  styleUrls: ['./pump-info-card.component.scss'],
})
export class PumpInfoCardComponent  implements OnInit {

  thresholds = { lower: 10, upper: 20 };
  constructor() { }

  ngOnInit() {}

}
