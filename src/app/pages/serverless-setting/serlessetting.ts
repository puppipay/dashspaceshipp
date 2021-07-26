import { Component, OnInit } from '@angular/core';
import {  LoadingController, NavController } from '@ionic/angular';
//import { Clipboard } from '@ionic-native/clipboard';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';



import { Dashcoin } from '../../providers/dashcoin';

import { Logger } from '../../providers/logger/logger';

import { TermsPage } from '../termspage/termspage';
import { FirebaseKycPage } from '../firebasekyc-page/firebasekyc-page';
import { AngularFireAuth } from '@angular/fire/auth';
//import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';

import { WindowService } from '../../providers/windowservice';


import * as firebase from 'firebase/app';


export class PhoneNumber {

  country: string;
  area: string;
  prefix: string;
  line: string;

  // format phone numbers as E.164
  get e164() {
    const num = this.country + this.area + this.prefix + this.line
    return `+${num}`
  }

}

/**
 * Generated class for the BalancesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-serlessetting',
  templateUrl: 'serlessetting.html',
})
export class SerlessettingPage implements OnInit {

  public whichsegment = "kyc";
   windowRef: any;

  phoneNumber = new PhoneNumber()

  verificationCode: string;

  user: any;

  loading: any;
  plan: any;
  plans: any;
  phone : string;
  phonecountry : string;
  otp : any;
  verificationId: string;
  error: string;
  relationship = 'dashcoin';
  feesdata: any;
  externaldashcoinwallet: any;

  chargingdata: any;
  chargingamount : any;
  dashcoinwalletbalance: any;
  dashcoinwallet: any;

  feesamount : any;
  serverless: any;
  feeslevel: any;
  dashcoinerror: any;
  availablePlans : any;
  pagesubscribed : boolean = false;
  plandata : any;

  constructor(public navCtrl: NavController, 
//              private clipboard: Clipboard,
              public events: Events,
    private logger: Logger,

              public router: Router,
//              private nativeauth: FirebaseAuthentication,
              private fireauth: AngularFireAuth,
              private win: WindowService,
              public dashcoinService: Dashcoin,
              public loadingCtrl: LoadingController,
	      ) {

       this.serverless = {
	contractid: 'CONT1',
	balance: '',
	walletaddress: '',
	fees: '',

       };
       this.dashcoinerror = '';

       this.feeslevel = [
	 {levelname: "low", levelfees: 20},
	 {levelname: "medium", levelfees: 30},
	 {levelname: "high", levelfees: 50},

       ];

       this.plandata = {
	  vendoraddress: '',
          balance: {}

       };
       this.externaldashcoinwallet = {
         sendaddress: '',
         sendamount: ''
       };

       this.feesdata = {
	  address: '',
          balance: ''
       };

       this.chargingdata = {
	  address: '',
          balance: ''
       };
       this.dashcoinwalletbalance = {
            address: '',
            balance: '',
            unconfirmed_balance: ''
       };


       this.feesamount = "0";




   this.events.subscribe('wallet:dashcoinbalanceupdate', () => {
   });

   this.events.subscribe('wallet:dashcoinbalanceupdate', () => {
   });


  }

  ngOnInit() {
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')

    this.windowRef.recaptchaVerifier.render()
  }


   loadwallets() {
  }

  clearAllCache() {

      setTimeout(() => {
      }, 500);
  }

  ionViewDidLoad() {
    this.logger.log('ionViewDidLoad AdminPage');
  }


  copyaddr() {
//   this.clipboard.copy(this.walletbalance.address);
  }

  gototerms() {
    this.router.navigateByUrl('/termspage');
  }

  gotokyc() {
    this.router.navigateByUrl('/kycpage');
  }

  gotohome() {
    this.router.navigateByUrl('/tabs/tab1');
  }

  showLoader(){

    this.loading = this.loadingCtrl.create({
      message: 'Working...'
    });

    this.loading.present();

  }

  sendotp() {
/*
    this.nativeauth.verifyPhoneNumber(this.phone,  60).then(credential => {

       // if instant verification is true use the code that we received from the firebase endpoint, otherwise ask user to input verificationCode:
    if(credential.instantVerification) { 
    var code =  credential.code ;

    this.verificationId = credential.verificationId;

    this.nativeauth.signInWithVerificationId( this.verificationId, code).then(res =>     { 
      alert('linked');
    }).catch(err=>{
      alert('failed');

    });
 

    }else {
      alert("Enter OTP code");
    }

    });
*/
  }

  verifyotp() {
/*

    this.nativeauth.signInWithVerificationId( this.verificationId, this.otp).then(res =>     { 

          this.logger.info(res);
          alert("phone verified");     

      })
      .catch(err => {
        this.logger.info(`login failed ${err}`);
        this.error = err.message;
      });
*/
  }

  sendLoginCode() {

    const appVerifier = this.windowRef.recaptchaVerifier;

    // const num = this.phoneNumber.e164;
    if(!this.phonecountry || !this.phone) {

	alert("Enter phone number and country code");
        return;
    }


    if(!(/^\d+$/.test(this.phone)))
    {
	alert("Enter only numbers in phone number");
        return;
    }
   
    if(!(/^\d+$/.test(this.phonecountry)))
    {
	alert("Enter only numbers in country code");
        return;
    }
   
   
   
    var tmpphone = '+'+this.phonecountry+this.phone;

    firebase.auth().signInWithPhoneNumber(tmpphone, appVerifier)
            .then(result => {

                this.windowRef.confirmationResult = result;

            })
            .catch( error => this.logger.info(error) );

  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
                  .confirm(this.otp)
                  .then( result => {

                    this.user = result.user;

    })
    .catch( error => this.logger.info(error, "Incorrect code entered?"));
  }




}
