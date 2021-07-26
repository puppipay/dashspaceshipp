import { ViewChild, Component } from '@angular/core';
import {  AlertController, NavController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { WelcomePage } from '../welcome/welcome';
import { environment } from '../config/environment';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Logger } from '../../providers/logger/logger';
import { TermsuserService } from './terms-user.service';

import { PlatformProvider } from '../../providers/platform/platform';
import { Events } from '@ionic/angular';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';




let termsurl = environment.termsurl;

@Component({
  selector: 'termspage',
  templateUrl: 'termspage.html'
})
export class TermsPage {

signup: FormGroup;
  errorMessage: string = '';

  usagedata : string;
  useraccount : any = {
     termsagreed: 'no',
  } ;

  loggedinuser : any = null;

  warrantydata : string;
  changellydata : string;
  feesdata : string;
  role: string;
  email: string;
  password: string;
  loading : any;
  isCordova: boolean;
  termsurl : any;
  registrationcode: string;
  countries:any ;
  selectCode: any;
  selectedCountry: string;
  pagesubscribed : boolean = false;

//  @ViewChild('select1') select1: Select;

  constructor(public router: Router, 
                private storage: Storage,
                private events: Events,
                public alertController: AlertController,

                private logger: Logger,
                public termsuserservice: TermsuserService,
                public http: Http,
    		private platformProvider: PlatformProvider,
		public loadingCtrl: LoadingController) {
   this.selectedCountry = '';
   this.loadhtml () ;

this.countries = [
{
  code: '+91',
  name: 'India'
},
{
  code: '+1',
  name: 'Italy'
},
{
  code: '+1',
  name: 'Pakistan'
},
{
  code: '+1',
  name: 'United Kingdom'
},
{
  code: '+1',
  name: 'Germany'
},
{
  code: '+1',
  name: 'Russia'
},
{
  code: '+1',
  name: 'Thailand'
},
{
  code: '+1',
  name: 'China'
},
{
  code: '+1',
  name: 'Korea'
},
{
  code: '+1',
  name: 'America'
},
{
  code: '+1',
  name: 'Others'
}
];

  this.usagedata =  '';
  this.warrantydata =  '';
  this.changellydata =  '';
  this.feesdata =  '';
   
  this.loaduser() ;
  this.loadaccount() ;
 

  }

  openSelect() {
/*
    setTimeout(() => {
      this.select1.open();
    }, 150);
*/
  }

   ionViewWillEnter() {
  this.loaduser() ;
  this.getaccount() ;

  }

  ngOnInit() {

  this.loaduser() ;
  this.loadaccount() ;
  }

async  loadaccount() {
 this.useraccount = await this.termsuserservice.getuseraccount();

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

async  loaduser() {
 this.loggedinuser = await this.termsuserservice.getloggedinuser();

}

  ionViewDidLoad() {

  }

  loadhtml () {

  var lusage =  this.http.get("/assets/html/usage.html").subscribe((res:any) => {
          if(res) {
          this.usagedata = res._body;
          lusage.unsubscribe();
          }
        }, (err) => {
        });

  var cusage =  this.http.get("/assets/html/changelly.html").subscribe((res:any) => {
          if(res) {
          this.changellydata = res._body;
          cusage.unsubscribe();
          }
        }, (err) => {
        });

  var wusage =  this.http.get("/assets/html/warranty.html").subscribe((res:any) => {
          if(res) {
          this.warrantydata = res._body;
           wusage.unsubscribe();
          }
        }, (err) => {
        });

  var fusage =  this.http.get("/assets/html/fees.html").subscribe((res:any) => {
          if(res) {
          this.feesdata = res._body;
           fusage.unsubscribe();
          }
        }, (err) => {
        });
  }


  termsApproved() {
      //this.userinfo.updateTermsApproval(); 
  }

  changelytermsApproved() {
      //this.userinfo.updateChangelyTermsApproval(); 
  }

  feestermsApproved() {
      //this.userinfo.updateFeesTermsApproval(); 
  }

  savecountry() {
  }


  gotohome() {
    this.router.navigateByUrl('/tabs/tab1');
  }


async   accept() {
    this.loggedinuser = await this.termsuserservice.getloggedinuser();

    if( !this.loggedinuser ) {
    this.presentAlert("", "", "User not loggedin. ");
       return;
    }

    if( this.loggedinuser.uid == '') {
    this.presentAlert("", "", "User not loggedin. ");
       return;
    }


    var data = {
     email: this.loggedinuser.email,
     googleid: this.loggedinuser.uid,
     name: this.loggedinuser.displayName,
     termsagreed: 'yes'
   };

   this.termsuserservice.createaccount(data).then((data1: any) => {
       if(data1) {
     this.useraccount = data1;
      this.storage.set(environment.storageuniq+'useraccount', JSON.stringify(this.useraccount) ).then(xx=>{
       this.termsuserservice.reflectuseraccount();

   });;

     this.storage.set(environment.storageuniq+'token', "MobKey "+ this.useraccount.token);

     }

     this.gotohome() ;

   });;


  }




  showLoader(){

    this.loading = this.loadingCtrl.create({
      message: 'Authenticating...'
    });

    this.loading.present();

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
