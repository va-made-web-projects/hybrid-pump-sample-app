import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-storage-usage',
  templateUrl: './storage-usage.component.html',
  styleUrls: ['./storage-usage.component.scss'],
})
export class StorageUsageComponent implements OnInit {
  @Input() capacity: number = 0; // Total storage capacity in bytes
  @Input() usage: number = 0; // Current storage usage in bytes

  usagePercentage: number = 0; // Percentage of storage used

  constructor() {}

  ngOnInit() {
    this.calculateUsagePercentage();
  }

  ngOnChanges() {
    this.calculateUsagePercentage();
  }

  private calculateUsagePercentage() {
    if (this.capacity > 0) {
      this.usagePercentage = (this.usage / this.capacity) * 100;
    } else {
      this.usagePercentage = 0;
    }
  }
}
