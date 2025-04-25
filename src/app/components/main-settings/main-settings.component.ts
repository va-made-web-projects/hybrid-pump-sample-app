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
    this.loadNotifications();
    // Use matchMedia to check the user preference
  }

  async loadDarkMode() {
    this.darkMode = (await Preferences.get({ key: 'darkMode' })).value === 'true';
  }
  async loadNotifications() {
    this.checkNotificationPreferences()
  }

  async checkNotificationPreferences() {
    const storedNotificationsPreference = await Preferences.get({ key: 'notificationsActive' });
    if (storedNotificationsPreference && storedNotificationsPreference.value !== null) { // Use stored preference if available
      this.notifications = storedNotificationsPreference.value === 'true'
    } else {
      this.notifications = false;
      await Preferences.set({key:'notificationsActive', value:'false' });
    }
  }

    // Listen for the toggle check/uncheck to toggle the dark palette
  toggleChange(event: CustomEvent) {
    this.darkModeService.toggleDarkPalette(event.detail.checked);
  }

  async setNotif(value: boolean) {
    await Preferences.set({key:'notificationsActive', value: value.toString() });
    this.notifications = value;
  }

  toggleNotifications(event: CustomEvent) {
    // check permissions for notifs
    this.setNotif(event.detail.checked)
    console.log(`Set Notifs to ${this.notifications}`)
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
