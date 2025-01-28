import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-point',
  templateUrl: './data-point.component.html',
  styleUrls: ['./data-point.component.scss'],
})
export class DataPointComponent  implements OnInit {
  @Input() timestamp!: string
  @Input() sensorValue!: number

  constructor() { }

  ngOnInit() {}

}
