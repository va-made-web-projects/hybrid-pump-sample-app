  import { Component, OnInit } from '@angular/core';
  import { App } from '@capacitor/app';
  import { Preferences } from '@capacitor/preferences';
  import { AppUsageService } from 'src/app/services/app-usage.service';

  @Component({
    selector: 'app-app-usage-tracker',
    templateUrl: './app-usage-tracker.component.html',
    styleUrls: ['./app-usage-tracker.component.scss'],
  })
  export class AppUsageTrackerComponent  implements OnInit {
    usageTime: string = '0h 0m 0s';

    constructor(private appUsageService: AppUsageService) {}

    ngOnInit() {
      // Update usage time every second
      this.startUpdateTimer();
    }

    ngOnDestroy() {
      // Cleanup if needed
    }

    private startUpdateTimer() {
      this.appUsageService.startTracking();
      setInterval(() => {
        // console.log('Updating usage time...');
        this.usageTime = this.appUsageService.getTotalUsageTimeFormatted();
      }, 1000);
    }

    resetUsageTime() {
      this.appUsageService.resetUsageTime();
    }
  }

