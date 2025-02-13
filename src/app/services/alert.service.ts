import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

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
  }
}
