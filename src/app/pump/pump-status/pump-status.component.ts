import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pump-status',
  templateUrl: './pump-status.component.html',
  styleUrls: ['./pump-status.component.scss'],
})
export class PumpStatusComponent  implements OnInit {
  @Input({ required: true }) pumpStatus!: string;
  constructor() { }

  ngOnInit() {}

}
