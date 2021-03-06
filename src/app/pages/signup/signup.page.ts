/***
Ionic 4 Firebase Email Auth
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/
import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Logger } from '../../providers/logger/logger';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  email: string = '';
  password: string = '';
  phone: string = '';
  error: string = '';
  username: string = '';
  image: number;
  constructor(private fireauth: AngularFireAuth, private router: Router, private toastController: ToastController, private platform: Platform, public loadingController: LoadingController,
     private logger: Logger,

    public alertController: AlertController) {

  }

  async openLoader() {
    const loading = await this.loadingController.create({
      message: 'Please Wait ...',
      duration: 2000
    });
    await loading.present();
  }
  async closeLoading() {
    return await this.loadingController.dismiss();
  }

  signup() {
    this.fireauth.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(res => {
        if (res.user) {
          this.logger.info(res.user);
         this.sendEmailVerification() ;
          this.updateProfile();
        }
      })
      .catch(err => {
        this.logger.info(`signup failed ${err}`);
        this.error = err.message;
      });
  }

  updateProfile() {
    this.fireauth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.logger.info(user);
        user.updateProfile({
          displayName: this.username,
          photoURL: `https://picsum.photos/id/${this.image}/200/200`
        })
          .then(() => {
           this.router.navigateByUrl('/tabs/tab1');

          })
      }
    })
  }

  async sendEmailVerification() {
     this.fireauth.auth.currentUser.sendEmailVerification()
      .then(data => {
        this.presentToast('Email verification sent', false, 'bottom', 1000);
        this.router.navigateByUrl('/verifyemail');
      })
      .catch(err => {
        this.logger.info(` failed ${err}`);
        this.error = err.message;
      });

 }


  async presentToast(message, show_button, position, duration) {
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: show_button,
      position: position,
      duration: duration
    });
    toast.present();
  }

}
