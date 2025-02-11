import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class UserTypeService {

  userType = signal<string | null>(null); // Store user type in memory


  constructor() {
    this.loadUserType(); // Load from Preferences on service initialization
  }

  async loadUserType() {
    const { value } = await Preferences.get({ key: 'userType' });
    if (!value) {
      this.userType.set('user');
    } else {
      this.userType.set(value);

    }
  }

  setUserType(type: string) {
    this.userType.set(type);
    this.saveUserType();
  }

  async saveUserType() {
    await Preferences.set({ key: 'userType', value: this.userType()! }); // Save to Preferences
  }

  clearUserType() {
    this.userType.set(null); // Clear in memory = null;
    Preferences.remove({ key: 'userType' }); // Clear from Preferences
  }
}
