import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-battery-level',
  templateUrl: './battery-level.component.html',
  styleUrls: ['./battery-level.component.scss'],
})
export class BatteryLevelComponent implements OnChanges {
  @Input() value: number = 0;

  batteryPercentage: number = 0;
  batteryStateClass: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.updateBatteryState();
    }
  }

  private updateBatteryState() {
    console.log('Battery level:', this.value);
    // Calculate percentage
    this.batteryPercentage = Math.min(100, (this.value / 2500) * 100);
    console.log('Battery level:', this.batteryPercentage);

    // Determine battery state
    if (this.batteryPercentage > 75) {
      this.batteryStateClass = 'full';
    } else if (this.batteryPercentage > 50) {
      this.batteryStateClass = 'medium';
    } else if (this.batteryPercentage > 25) {
      this.batteryStateClass = 'low';
    } else {
      this.batteryStateClass = 'critical';
    }
  }
}
