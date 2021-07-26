import { Component } from '@angular/core';
import {   AlertController, NavController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { WelcomePage } from '../welcome/welcome';
import { environment } from '../config/environment';
import { Logger } from '../../providers/logger/logger';
import { PlatformProvider } from '../../providers/platform/platform';
import { Events } from '@ionic/angular';


let termsurl = environment.termsurl;
let usageemail = environment.supportcontact;

@Component({
  selector: 'usagehelp',
  templateUrl: 'usagehelp.html'
})
export class UsageHelp {

  errorMessage: string = '';


  role: string;
  email: string;
  password: string;
  loading : any;
  isCordova: boolean;
  termsurl : any;
  usageemail: string = usageemail;
  registrationcode: string;

  constructor(public navCtrl: NavController, 
                private storage: Storage,
                private events: Events,
                private logger: Logger,
    		private platformProvider: PlatformProvider,
		public loadingCtrl: LoadingController) {

//   this.displayitem =   this.route.snapshot.paramMap.get('displayitem');
  }

  ionViewWillEnter() {
 //   this.initialiselisteners();
  }
  ionViewWillLeave() {
//    this.removelisteners () ;
  }


  ionViewDidLoad() {

  }
 
   dismiss () {
//           this.viewCtrl.dismiss();
   }


}
