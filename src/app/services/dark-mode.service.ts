import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  paletteToggle = false;


  constructor() {
    this.loadDarkMode();
  }

  async loadDarkMode() {
    const storedTheme = await Preferences.get({ key: 'darkMode' });
    console.log(storedTheme);
    if (storedTheme && storedTheme.value !== null) { // Use stored preference if available
      this.initializeDarkPalette(storedTheme.value === 'true');
    } else {
      this.initializeDarkPalette(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }

  // Check/uncheck the toggle and update the palette based on isDark
  initializeDarkPalette(isDark: boolean) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }

  // Add or remove the "ion-palette-dark" class on the html element
  toggleDarkPalette(shouldAdd: boolean) {
    Preferences.set({ key: 'darkMode', value: shouldAdd.toString() }); // Save preference
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }


}
