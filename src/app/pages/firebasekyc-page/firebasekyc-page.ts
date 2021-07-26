import { Component } from '@angular/core';
import { NavController,  LoadingController  } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { finalize } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Storage } from '@ionic/storage';




import { Events } from '@ionic/angular';
import { KycService } from './kyc.service';
import { kycData } from '../models/kycdata.model';
import { kycStatus } from '../models/kycstatus.model';

import {environment} from '../config/environment';
import { Logger } from '../../providers/logger/logger';
import { TermsuserService } from '../termspage/terms-user.service';



@Component({
  selector: 'firebasekyc-page',
  templateUrl: 'firebasekyc-page.html'
})

//https://blog.angular.io/file-uploads-come-to-angularfire-6842352b3b47
// https://github.com/angular/angularfire2/blob/master/docs/storage/storage.md

export class FirebaseKycPage {
  ref : any;
  task : any;
  uploadPercent: any;
  errorMessage = '';
  uploaddone = 0;
  downloadURL: any;
  uploadfile : any;

  loggedinuser : any = null;
  url: string;
  useraccount : any = {
     termsagreed: 'no'
  } ;

  kycstatus: kycStatus = {
    kycdone: '',
    kycid: '',          
    googleid: '',          
    email: '',          
    statusaction: '',     
    statusmsg: '',         

  };


  uploadProgress : any;
   kycdata =  { 
   kycdone: "false", // submitted
   name: "",
   id: "",
   kycid: "",
   googleid: "",
   message: "",
   updatedate: "",
   loginphone: "",
   kycphone: "",
   country: "",
   kycemail: "",
   loginemail: "",
   address: "",
   kycdoctype: "",
   kycdocnumber: "",
   kycdocument: "",
   };


   constructor(
        public navCtrl: NavController,
         public events: Events,
        public logger: Logger,
         public alertController: AlertController,
        public termsuserservice: TermsuserService,
        public storage: Storage,
        public kycService: KycService,
	) {

  this.loaduser() ;
  this.loadkycdata() ;
  this.getaccount() ;

  }

ionViewWillEnter() {
  this.loaduser() ;
  this.loadkycdata() ;
  this.getaccount() ;

}

ngOnInit() {

  this.loaduser() ;
  this.loadkycdata() ;
  this.getaccount() ;
}
  
async  getaccount() {
   this.loggedinuser = await this.termsuserservice.getloggedinuser();


    if(this.loggedinuser.uid == '') {
     return;
   }

   var data = {
     googleid: this.loggedinuser.uid,
     };
 
     this.termsuserservice.getaccount(data).then(data1=> {
     this.logger.info(data1);
     if(data1) {
     this.useraccount = data1
        this.storage.set(environment.storageuniq+'useraccount', JSON.stringify(this.useraccount) ).then(xx=>{
       this.termsuserservice.reflectuseraccount();

   });;

      this.storage.set(environment.storageuniq+'token', "MobKey "+ this.useraccount.token);

     }
   } ,(err) => {
      if(err._body) {
    this.presentAlert("", "", "Agree terms of usage. ");
    } else {
    this.presentAlert("", "", "Error reading account. ");
    }

   });

  
  
  }


 async loaduser() {
  this.loggedinuser = await this.termsuserservice.getloggedinuser();
}
 async loadkycdata() {

   this.kycstatus = await this.kycService.getkycstatus();

}


  async getkycdata() {

  this.loggedinuser = await this.termsuserservice.getloggedinuser();

   if(!this.loggedinuser) {
     return;
   }

   var data = {
     email: this.loggedinuser.email,
     googleid: this.loggedinuser.uid,
   };

   this.kycService.getkycdata(data).then((kycstatus: any) => {
     if(kycstatus) {
     this.storage.set(environment.storageuniq+'kycstatus', kycstatus).then(xx=>{
       this.kycService.reflectkycstatus();

       });;
      }
   });;


  }

async  kycsubmit() {
  this.loggedinuser = await this.termsuserservice.getloggedinuser();
   this.useraccount = await this.termsuserservice.getuseraccount();

   this.kycdata.googleid = this.loggedinuser.uid;
   this.kycdata.loginemail = this.loggedinuser.email;
   this.kycdata.loginphone = this.loggedinuser.phoneNumber;
  
   var data : kycData = this.kycdata;
   if(!(this.useraccount && this.useraccount.kycid != ''))
   {
      this.logger.info("account not created");
      alert("account not created");
      return;
   }

   this.kycService.registeruserkyc(data).then((kycstatus: any) => {
     if(kycstatus) {
     this.storage.set(environment.storageuniq+'kycstatus', kycstatus).then(xx=>{
       this.kycService.reflectkycstatus();
     //   this.loadkycdata() ;

       });;
     }
   });;

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


}
