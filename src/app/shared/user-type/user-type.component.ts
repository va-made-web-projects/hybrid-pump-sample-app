import { ModalController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { UserTypeService } from 'src/app/services/user-type.service';
import { CodeModalComponent } from '../code-modal/code-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.scss'],
})
export class UserTypeComponent  implements OnInit {

  userType: string | null = null;
  isAdmin: boolean = false; // For the toggle model


  constructor(private userTypeService: UserTypeService,
    private modalController: ModalController,
    private toastController: ToastController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.userType = this.userTypeService.userType(); // Get initial value
    this.isAdmin = this.userType === 'admin';
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  setUserType() {
    this.userType = this.isAdmin ? 'admin' : 'user';  // Simplified logic
    if (this.isAdmin) {
      this.presentCodeModal();
    } else {
      this.setUserToRegular();
    }
  }

  async presentCodeModal() {
    const modal = await this.modalController.create({
      component: CodeModalComponent,
      backdropDismiss: true // Keep backdrop dismiss disabled
    });

    modal.onDidDismiss().then(async (data)=> {
      if (data && data.data && data.data.codeIsValid) {
        // Code is valid, navigate to the next page
        await modal.dismiss();
        this.presentToast('Changed to Admin Mode!', 'success'); // Show green toast
        this.setUserToAdmin();
        // this.navController.navigateForward('/next-page'); // Replace '/next-page' with your actual route
        // show toast that code is correct
      } else {
        // Code is invalid or modal was dismissed without valid code
        // You can choose to:
        // 1. Re-present the modal:
        // this.presentCodeModal();  //or
        // 2. Display an error message to the user (recommended):
        this.setUserToRegular();
        await modal.dismiss();
        this.presentToast('Still is User Mode.', 'danger'); // Show red toast

        console.log("Incorrect Code. Please try again.")
        // 3. Or do nothing (stay on the same page).
      }
    });

    return await modal.present();
  }


async presentToast(message: string, color: string) {  //Toast method
  const toast = await this.toastController.create({
    message: message,
    duration: 4000, // Duration in milliseconds
    color: color, // Use 'success' for green, 'danger' for red
    position: 'top' // You can change the position
  });
  toast.present();
}


  setUserToAdmin() {
    this.userTypeService.setUserType('admin');
    this.isAdmin = true;
    this.userType = this.userTypeService.userType(); // Update display
    // reload current page
    this.reloadCurrentRoute();
  }


  setUserToRegular() {
    this.userTypeService.setUserType('user');
    this.isAdmin = false;
    this.userType = this.userTypeService.userType(); // Update
    this.reloadCurrentRoute();

  }

  clearUser() {
    this.userTypeService.clearUserType();
    this.isAdmin = false;
    this.userType = this.userTypeService.userType(); // Update display
  }

}
