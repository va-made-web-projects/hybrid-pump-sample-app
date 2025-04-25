import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';


@Injectable({
  providedIn: 'root'
})
export class AlertService {
  isAlertShow = false
  didShowError = false

  constructor(private alertController: AlertController) { }

  async presentAlert() {
    if (this.didShowError) {
      return
    }
    if (this.isAlertShow) {
      return
    }
    const alert = await this.alertController.create({
      header:"Problem with Pump",
      subHeader:"There is a problem with the pump",
      message:"There is a problem with the hybrid pump. You can try to restart the pump, if problem continues please contact support.",
      buttons: ['Ok'],
      backdropDismiss: true,
    });
    if (!this.isAlertShow) {
      this.isAlertShow = true
      this.didShowError = true
      await alert.present();
    }

    alert.onDidDismiss().then(() => {
      this.isAlertShow = false
    })

    this.checkNotificationPreferences().then(isNotif => {
      console.log(`DFSDFSDFSDFS ${isNotif}`)
      if(isNotif) {

        this.showLocalNotification()
      }
    })
  }

  async checkNotificationPreferences() {
    const storedNotificationsPreference = await Preferences.get({ key: 'notificationsActive' });
    if (storedNotificationsPreference && storedNotificationsPreference.value !== null) { // Use stored preference if available
      return storedNotificationsPreference.value === 'true'
    } else {
      return false
    }
  }

  async showLocalNotification() {
    await LocalNotifications.schedule({
        notifications: [
            {

                title: "Hybrid Pump Error",
                body: "The hybrid pump has an error.",
                id: Math.ceil(Math.random() * 100), // any random int
                schedule: { at: new Date(Date.now() + 1000 * 1) },
                ongoing: false // (optional, default: false)
                //if ongoing:true, this notification can't be cleared
            }
        ]
    });
  }
}
