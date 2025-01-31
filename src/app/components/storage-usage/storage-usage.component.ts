import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { PageDataService } from 'src/app/services/page-data.service';

@Component({
  selector: 'app-storage-usage',
  templateUrl: './storage-usage.component.html',
  styleUrls: ['./storage-usage.component.scss'],
})
export class StorageUsageComponent implements OnInit, OnChanges {
  @Input() capacity: number = 16 * 1024 * 1024; // Total storage capacity in bytes (16 MB)
  @Input() usage: number = 0; // Current storage usage in bytes

  usagePercentage: number = 0; // Percentage of storage used

  constructor(private pageDataService: PageDataService) {}

  ngOnInit() {
    this.getUsage();
    this.calculateUsagePercentage();

    // get size every 1 minute
    setInterval(() => {
      this.getUsage();
      this.calculateUsagePercentage();
    }, 1000);
  }

  getUsage() {
    this.pageDataService.readCurrentPage().then(
      (currentPage) => {
        if (currentPage !== null) {
          this.usage = currentPage! * 256;
        }
      }
    );
  }
  ngOnChanges() {
    this.calculateUsagePercentage();
  }

  private calculateUsagePercentage() {
    if (this.capacity > 0) {
      this.usagePercentage = (this.usage / this.capacity) * 100;
      console.log(this.usagePercentage)
    } else {
      this.usagePercentage = 0;
    }
  }
}
