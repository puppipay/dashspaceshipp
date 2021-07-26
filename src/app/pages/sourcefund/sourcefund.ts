import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AlertController, ToastController } from '@ionic/angular';
import { SourcefundService } from './sourcefund.service';
import { sourcefundData } from '../models/sourcefunddata.model';
import { Storage } from '@ionic/storage';
import {environment} from '../config/environment';
import { Logger } from '../../providers/logger/logger';



@Component({
  selector: 'page-sourcefund',
  templateUrl: 'sourcefund.html',
  styleUrls: ['./sourcefund.scss'],
})
export class SourcefundPage {
  submitted = false;
  sourcefundMessage: string;
  systemstatus: string;
  systemmessage: string;
  
  systemmessages : any[] = [];

  sourcefunddata = {
            id: '',
            requestid: '',         
            qcontent: '',           
            subject: '',           
            rcontent: '',     
            qstatus: '',     
            agentid: '',     
       name: '',     
       googleid: '',     
       loginemail: '',     
       loginphone: '',     
       updatedate: '',     
       country: '',     
   };

  loggedinuser : any = null;
  url: string;

  useraccount : any = {
     termsagreed: 'no'
  } ;


  request : string;
  subject : string;

  requestanswer = {
      id: '',
            requestid: '',
            qcontent: '',
            rcontent: '',
            qstatus: '',
            subject: '',           
            agentid: '',
       name: '',
       googleid: '',
       loginphone: '',     
       loginemail: '',
       updatedate: '',
       country: '',

  };



  constructor(
    public alertController: AlertController,
    public toastCtrl: ToastController,
    private logger: Logger,

    public storage: Storage,
    public sourcefundService: SourcefundService
  ) { 
     this.loaduser() ;
     this.getaccount() ;
     this.getrequestanswer();
     this.loadqadata() ;
     this.getsystemstatus() ;

  }

  ionViewWillEnter() {
     this.loaduser() ;
     this.getaccount() ;
     this.loadqadata() ;
 }

 ngOnInit() {
     this.loaduser() ;
     this.getaccount() ;
     this.loadqadata() ;

 }



  loaduser() {
     this.storage.get(environment.storageuniq+'loggedinuser').then(data=> {
        if(data) {
      // alert(data);
      this.logger.info(data);
      this.loggedinuser = JSON.parse(data);
        }
     }).catch(err => {
      this.loggedinuser = null;

      });
}
 loadqadata() {

   this.storage.get(environment.storageuniq+'requestanswer').then((data: any)=> {
      if(data) {
       this.requestanswer = data;
      }
      else {
        this.getrequestanswer();
      }
   });

}


   senduserrequest() {

   if(!this.loggedinuser) {
     this.loaduser() ;
       this.presentAlert("", "", "User not logged in");
     return;
   }

   if(this.loggedinuser.uid == '') {
       this.presentAlert("", "", "User not logged in");
     return;
   }

  if(this.request.length < 20) {
       this.presentAlert("", "", "Describe request in details");
    return;
  }

  if(this.subject.length < 10) {
       this.presentAlert("", "", "Mention subject ");
    return;
  }


   this.sourcefunddata.googleid = this.loggedinuser.uid;
   this.sourcefunddata.loginemail = this.loggedinuser.email;
   this.sourcefunddata.loginphone = this.loggedinuser.phoneNumber;
   this.sourcefunddata.qstatus = 'new';
   this.sourcefunddata.qcontent = this.request;
   this.sourcefunddata.subject = this.subject;
   this.sourcefunddata.name =  this.loggedinuser.displayName;

   var data : sourcefundData = this.sourcefunddata;

   this.sourcefundService.senduserrequest(data).then((response: any) => {
     if(response) {
     this.requestanswer = response;
     this.storage.set(environment.storageuniq+'requestanswer', this.requestanswer).then(xx=>{

       });;
     }
   });;

  }

   getrequestanswer() {

   if(!this.loggedinuser) {
 //      this.presentAlert("", "", "User not logged in");
     return;
   }

   if(this.loggedinuser.uid == '') {
//       this.presentAlert("", "", "User not logged in");
     return;
   }

   var data = {
     email: this.loggedinuser.email,
     googleid: this.loggedinuser.uid,
   };

   this.sourcefundService.getrequestanswer(data).then((requestanswer: any) => {
     if(requestanswer) {
     this.requestanswer = requestanswer;
     this.storage.set(environment.storageuniq+'requestanswer', requestanswer).then(xx=>{

       });;
      }
   });;


  }

  getsystemstatus() {
    var data = {};

     this.sourcefundService.getsystemstatus(data).then((data1: any) => {
     if(data1) {
      this.systemmessages = data1;
     }
    });
  }

   getaccount() {

   if(!this.loggedinuser) {
     return;
   }

    if(this.loggedinuser.uid == '') {
     return;
   }


   var data = {
     googleid: this.loggedinuser.uid,
     };

     this.sourcefundService.getaccount(data).then(data1=> {
     this.logger.info(data1);
     if(data1) {
     this.useraccount = data1
      this.storage.set(environment.storageuniq+'useraccount', JSON.stringify(this.useraccount) );
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
