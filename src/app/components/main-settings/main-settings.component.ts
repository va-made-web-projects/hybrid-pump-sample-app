import { Component, OnInit, inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { DarkModeService } from 'src/app/services/dark-mode.service';


@Component({
  selector: 'app-main-settings',
  templateUrl: './main-settings.component.html',
  styleUrls: ['./main-settings.component.scss'],
})
export class MainSettingsComponent  implements OnInit {
  notifications = false;
  soundEffects = false;
  autoConnect = false;
  autoStart = false;
  autoStop = false;
  darkMode = false;

  paletteToggle = false;

  constructor(private darkModeService: DarkModeService) { }

  ngOnInit() {
    this.loadDarkMode();
    // Use matchMedia to check the user preference
  }

  async loadDarkMode() {
    this.darkMode = (await Preferences.get({ key: 'darkMode' })).value === 'true';

  }

    // Listen for the toggle check/uncheck to toggle the dark palette
  toggleChange(event: CustomEvent) {
    this.darkModeService.toggleDarkPalette(event.detail.checked);
  }



  toggleNotifications() {
    this.notifications = !this.notifications;
  }

  toggleSoundEffects() {
    this.soundEffects = !this.soundEffects;
  }

  toggleAutoConnect() {
    this.autoConnect = !this.autoConnect;
  }

  toggleAutoStart() {
    this.autoStart = !this.autoStart;
  }

  toggleAutoStop() {
    this.autoStop = !this.autoStop;
  }
}
