import { DeviceSettingsService } from '../../controls/device-settings.service';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pump-info-card',
  templateUrl: './pump-info-card.component.html',
  styleUrls: ['./pump-info-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ DeviceSettingsService ]
})
export class PumpInfoCardComponent  implements OnInit {
  @Input({ required: true }) upper!: string;
  @Input({ required: true }) lower!: string;

  connected = false;

  ngOnInit() {
  }

}
