import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AppUsageService {
  private startTime: number = 0;
  private totalUsageTime: number = 0;
  private isTracking: boolean = false;
  private storageKey = 'app_usage_time';

  constructor() {
    this.initStorage();
    this.initAppStateListeners();
  }
ngOnInit(): void {
}

  private async initStorage() {
    await this.loadSavedUsageTime();
  }

  private async loadSavedUsageTime() {
    const savedUsageTime = await Preferences.get({ key: this.storageKey });

    if (!savedUsageTime.value) {
        await Preferences.set({ key: this.storageKey, value: '0' });
        console.log('Key not found. Default value set.');
    } else {
        console.log('Key exists with value:', savedUsageTime.value);
    }      this.totalUsageTime = savedUsageTime ? parseInt(savedUsageTime.value!, 10) : 0;
  }

  private initAppStateListeners() {
    App.addListener('appStateChange', async (state) => {
      if (state.isActive) {
        console.log('App is active');
        this.startTracking();
      } else {
        this.stopTracking();
        await this.saveUsageTime();
      }
    });

  }

  private async saveUsageTime() {
    await Preferences.set({
      key: this.storageKey,
      value: this.totalUsageTime.toString(),
    });
  }

  startTracking() {
    if (!this.isTracking) {
      this.startTime = Date.now();
      this.isTracking = true;
    }
  }

  trackUpdate() {
    // console.log(`Tracking update ${this.isTracking}`);
    if (this.isTracking) {
      this.totalUsageTime += 1000;
      this.saveUsageTime();
    }
  }

  stopTracking() {
    if (this.isTracking) {
      const endTime = Date.now();
      this.totalUsageTime += (endTime - this.startTime);
      this.isTracking = false;
    }
  }

  getTotalUsageTime(): number {
    return this.totalUsageTime;
  }

  getTotalUsageTimeFormatted(): string {
    this.trackUpdate();
    const hours = Math.floor(this.totalUsageTime / 3600000);
    const minutes = Math.floor((this.totalUsageTime % 3600000) / 60000);
    const seconds = Math.floor((this.totalUsageTime % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  async resetUsageTime() {
    this.totalUsageTime = 0;
    this.startTime = 0;
    this.isTracking = false;
    await this.saveUsageTime();
  }
}

