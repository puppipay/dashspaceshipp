/**
*/
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import {environment} from '../config/environment';

import { KycService } from '../firebasekyc-page/kyc.service';
import { kycData } from '../models/kycdata.model';
import { Logger } from '../../providers/logger/logger';
import { TermsuserService } from '../termspage/terms-user.service';
import { loggedinUser } from '../models/loggedinuser.model' ;



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  error: string = '';
   testvalue: string;
  loggedinuser : loggedinUser; 

   walletwif : any = null;
   useraccount : any = {
     termsagreed: 'no'
  } ;


  constructor(private fireauth: AngularFireAuth,
    private router: Router,
    private storage: Storage,
    private logger: Logger,
    public termsuserservice: TermsuserService,

    private kycService: KycService,
    private toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController) {
    
    this.nullify() ;
    this.loaduser() ;
    this.loadaccount() ;
    this.loadwalletwif() ;

  }

  nullify() {
     this.loggedinuser = {
        uid: '',
        displayName: '',
        photoURL : '',
        phoneNumber: '',
        email: '',
        emailVerified: false
      };

    this.loadaccount() ;

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

  async loadaccount() {
  this.useraccount = await this.termsuserservice.getuseraccount();

 }


async loaduser() {
     this.loggedinuser = await this.termsuserservice.getloggedinuser();
}



  login() {
    this.fireauth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(res => {
        if (res) {
          this.logger.info(res);
          this.checkifemailverified() ;

        }
      })
      .catch(err => {
        this.logger.info(`login failed ${err}`);
        this.error = err.message;
      });
  }

   async getaccount() {
       setTimeout( async ()=>{
      await this.getaccount1();
       }, 500);

   }

   async getaccount1() {

     this.loggedinuser = await this.termsuserservice.getloggedinuser();
   if(!this.loggedinuser) {
    this.presentAlert("", "", "User not loggedin. ");
     return;
   }

    if(this.loggedinuser.uid == '') {
    this.presentAlert("", "", "User not loggedin. ");
     return;
   }

   var data = {
     googleid: this.loggedinuser.uid,
     };

     this.termsuserservice.getaccount(data).then(data1=> {
     this.logger.info(data1);
     if(data1) {
     this.useraccount = data1
        this.storage.set(environment.storageuniq+'useraccount', JSON.stringify(this.useraccount) );
      this.storage.set(environment.storageuniq+'token', "MobKey "+ this.useraccount.token);
        this.termsuserservice.reflectuseraccount();

     }
   }, (err) =>{
      this.logger.info(err._body);
    if(err._body) {
    this.presentAlert("", "", "Agree terms of usage. ");
    } else {
    this.presentAlert("", "", "Error reading account. ");
    }
   });


  }

  
  saveuser(user) {
     var xx : loggedinUser = {
     uid  : user.uid,
     displayName  : user.displayName,
     photoURL  : user.photoURL,
     phoneNumber  : user.phoneNumber,
     email  : user.email,
     emailVerified  : user.emailVerified,
     };
   
    this.loggedinuser = xx;

     if(!this.loggedinuser.uid  || this.loggedinuser.uid == '')
     {
        this.presentAlert("", "", "Error login. ");
     }
     console.log("saveuser="+ JSON.stringify(this.loggedinuser));
       this.storage.set(environment.storageuniq+'loggedinuser',JSON.stringify(this.loggedinuser)).then(x=> {
        this.termsuserservice.reflectloginuser();
       });
     return;   
  }

  checkifemailverified() {
    this.fireauth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.saveuser(user) ;
        this.getaccount() ;
        this.logger.info(user);
          if(user.emailVerified) {
             if(this.walletwif) { 
                this.router.navigateByUrl('/welcome');
             }else { 
                this.router.navigateByUrl('/tabs/tab4');
             }

          }else {
            this.router.navigateByUrl('/verifyemail');
          }
        
      }
    })
  }


 async presentAlert(title, subheader, message) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: subheader,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
    setTimeout( async ()=>{
      await alert.dismiss();
   }, environment.alertdelay);

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

  loadwalletwif() {
     this.storage.get(environment.storageuniq+'walletwif').then(data=> {
        if(data) {
      this.walletwif = data;
        }
     }).catch(err => {

      });
}

  gotokyc() {
    this.router.navigateByUrl('/kycpage');
  }


}
