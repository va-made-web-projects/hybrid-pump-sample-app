import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-settings',
  templateUrl: './main-settings.component.html',
  styleUrls: ['./main-settings.component.scss'],
})
export class MainSettingsComponent  implements OnInit {
  darkMode = false;
  notifications = false;
  soundEffects = false;
  autoConnect = false;
  autoStart = false;
  autoStop = false;


  constructor() { }

  ngOnInit() {}

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
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
