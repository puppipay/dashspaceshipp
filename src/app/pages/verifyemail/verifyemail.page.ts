import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Logger } from '../../providers/logger/logger';


@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.page.html',
  styleUrls: ['./verifyemail.page.scss'],
})
export class VerifyemailPage {
  email: string = '';
  password: string = '';
  error: string = '';
  username: string = '';
  image: number;
  constructor(private fireauth: AngularFireAuth, private router: Router, private toastController: ToastController, private platform: Platform, public loadingController: LoadingController,
     private logger: Logger,

    public alertController: AlertController) {

    this.getuserloggedin() ;

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


  getuserloggedin() {

    this.fireauth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.logger.info(JSON.stringify(user));
        this.email = this.fireauth.auth.currentUser.email;
      }
    });

  }

  confirmverified() {
    this.fireauth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.logger.info(user);
        if(user.emailVerified) {
            this.router.navigateByUrl('/welcome');

        }else {
          this.presentToast('Email verification not done', false, 'bottom', 1000);
        }
      }
    })

  }


  sendEmailVerification() {
     this.fireauth.auth.currentUser.sendEmailVerification()
      .then(data => {
        this.presentToast('Email verification sent', false, 'bottom', 1000);
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
