import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-code-modal',
  templateUrl: './code-modal.component.html',
  styleUrls: ['./code-modal.component.scss'],
})
export class CodeModalComponent {
  enteredCode: string = '';
  correctCode: string = '1776'; // Replace with your actual code
  errorMessage: string = ''; // For displaying error messages

  constructor(private modalController: ModalController) { }

  verifyCode() {
    if (this.enteredCode === this.correctCode) {
      this.modalController.dismiss({ codeIsValid: true });
    } else {
      this.modalController.dismiss({ codeIsValid: false });
    }
  }

  closeModal() {
    this.modalController.dismiss({ codeIsValid: false }); // Dismiss with invalid code if closed manually
  }

}
