import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AlertController, ToastController } from '@ionic/angular';
import { SupportService } from './support.service';
import { supportData } from '../models/supportdata.model';
import { Storage } from '@ionic/storage';
import {environment} from '../config/environment';

import { Logger } from '../../providers/logger/logger';
import { TermsuserService } from '../termspage/terms-user.service';



@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
  styleUrls: ['./support.scss'],
})
export class SupportPage {
  submitted = false;
  supportMessage: string;
  systemstatus: string;
  systemmessage: string;
  
  systemmessages : any[] = [];

  supportdata = {
            id: '',
            questionid: '',         
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


  question : string;
  subject : string;

  questionanswer = {
      id: '',
            questionid: '',
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
     public termsuserservice: TermsuserService,

    private logger: Logger,

    public storage: Storage,
    public supportService: SupportService
  ) { 
     this.loaduser() ;
     this.getaccount() ;
     this.getquestionanswer();
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



  async loaduser() {
   this.loggedinuser = await this.termsuserservice.getloggedinuser();

}
 loadqadata() {

   this.storage.get(environment.storageuniq+'questionanswer').then((data: any)=> {
      if(data) {
       this.questionanswer = data;
      }
      else {
        this.getquestionanswer();
      }
   });

}


async    senduserquestion() {
    this.loggedinuser = await this.termsuserservice.getloggedinuser();


   if(this.loggedinuser.uid == '') {
       this.presentAlert("", "", "User not logged in");
     return;
   }

  if(this.question.length < 20) {
       this.presentAlert("", "", "Describe question in details");
    return;
  }

  if(this.subject.length < 10) {
       this.presentAlert("", "", "Mention subject ");
    return;
  }


   this.supportdata.googleid = this.loggedinuser.uid;
   this.supportdata.loginemail = this.loggedinuser.email;
   this.supportdata.loginphone = this.loggedinuser.phoneNumber;
   this.supportdata.qstatus = 'new';
   this.supportdata.qcontent = this.question;
   this.supportdata.subject = this.subject;
   this.supportdata.name =  this.loggedinuser.displayName;

   var data : supportData = this.supportdata;

   this.supportService.senduserquestion(data).then((response: any) => {
     if(response) {
     this.questionanswer = response;
     this.storage.set(environment.storageuniq+'questionanswer', this.questionanswer).then(xx=>{

       });;
     }
   });;

  }

async    getquestionanswer() {
     this.loggedinuser = await this.termsuserservice.getloggedinuser();


   if(this.loggedinuser.uid == '') {
//       this.presentAlert("", "", "User not logged in");
     return;
   }

   var data = {
     email: this.loggedinuser.email,
     googleid: this.loggedinuser.uid,
   };

   this.supportService.getquestionanswer(data).then((questionanswer: any) => {
     if(questionanswer) {
     this.questionanswer = questionanswer;
     this.storage.set(environment.storageuniq+'questionanswer', questionanswer).then(xx=>{

       });;
      }
   });;


  }

  getsystemstatus() {
    var data = {};

     this.supportService.getsystemstatus(data).then((data1: any) => {
     if(data1) {
      this.systemmessages = data1;
     }
    });
  }

async    getaccount() {
     this.loggedinuser = await this.termsuserservice.getloggedinuser();

    if(this.loggedinuser.uid == '') {
     return;
   }


   var data = {
     googleid: this.loggedinuser.uid,
     };

     this.supportService.getaccount(data).then(data1=> {
     this.logger.info(data1);
     if(data1) {
     this.useraccount = data1
      this.storage.set(environment.storageuniq+'useraccount', JSON.stringify(this.useraccount) ).then(x=> {
       this.termsuserservice.reflectuseraccount();
       })  ;
;
      this.storage.set(environment.storageuniq+'token', "MobKey "+ this.useraccount.token);

     }
   },(err) => {
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
