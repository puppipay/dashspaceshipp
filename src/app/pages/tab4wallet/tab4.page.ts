import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

import { Http, Headers } from '@angular/http';
import { FromSatoshiPipe } from '../pipes/fromsatoshi';

import { Blue011ConsumeService } from './blue011.consume.service';
import { Blue011IssueService } from './blue011.issue.service';
import {environment} from '../config/environment';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router } from '@angular/router';
import { kycData } from '../models/kycdata.model';
import { TermsuserService } from '../termspage/terms-user.service';
import { KycService } from '../firebasekyc-page/kyc.service';
import { PolicyService } from './policy.service';
import { Logger } from '../../providers/logger/logger';
import { ChangellyCalls } from '../../providers/changelly';



declare var dashcore;

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {
whichdash = (environment.network=='testnet')?'tDASH': 'DASH';

whichsegment = "safety";

toamountusd : any;
toamountdash : any;
toamount : any;

walletwif : any;
walletaddress : any;
walletbalance : any;
feesdisplay : any = {
  stddiscountfeesdisp: '',
  stdgalaxyfeesdisp: '',
  stdstarfeesdisp: '',
  stdfeesdisp: '',
  rvtdiscountfeesdisp: '',
  rvtgalaxyfeesdisp: '',
  rvtstarfeesdisp: '',
  rvtfeesdisp: '',
  networkfees: '',
  };

consumefees = {
      networkfees: 0,
      fixed: 0,
      percentage: 0 
    };

loggedinuser : any = {
        uid: '',
        displayName: '',
        photoURL : '',
        phoneNumber: '',
        email: '',
        emailVerified: ''
      };
;
url: string;
kycdata : kycData ;
enableoverwrite = false;
copyofwalletkeptsafe=false;
wifisprotected = false;
knowwalletwifneededforrestore = false;
network = environment.network;
hidden: boolean = true;
hiddenwif = "******************************************";

useraccount : any = {
     termsagreed: 'no',
     testaddress: '',
     liveaddress: '',
     safetyconfirmation: 'false'
  } ;


constructor(public http: Http, 
         private blue011consume: Blue011ConsumeService,
         private blue011issue: Blue011IssueService,
         private socialSharing: SocialSharing,
         public alertController: AlertController,
         public termsuserservice: TermsuserService,
         public kycService: KycService,
         public policyService: PolicyService,
         private logger: Logger,
         private changellyCalls: ChangellyCalls,

         private clipboard: Clipboard,
         private router: Router,
	 public storage: Storage) {


   this.nullify() ;

}

nullify() {
     this.loggedinuser = {
        uid: '',
        displayName: '',
        photoURL : '',
        phoneNumber: '',
        email: '',
        emailVerified: ''
      };

      this.walletbalance = {
            address: '',
            balance: 0,
            balanceSat: 0,
            unconfirmedBalanceSat:0,
            unconfirmedBalance:0
     };
    this.loadaccount() ;

  this.storage.get(environment.storageuniq+'consumefees').then(xx=>{
     if(xx) {
       this.consumefees = xx;
     }
    });
}


ionViewWillEnter() {
  this.loadwalletwif() ;
  this.loaduser() ;
//  this.getkycdata() ;
  this.loadkycdata() ;
  this.getaccount() ;
  this.loadwalletbalance() ;
   this.getconsumefees() ;

}

ngOnInit() {
  this.loadwalletwif() ;
  this.loaduser() ;
//  this.getkycdata() ;
  this.loadkycdata() ;
  this.loadaccount() ;

  this.loadwalletbalance() ;
   this.getconsumefees() ;


}


getconsumefees() {
   var detail = {
     network: this.network
   };

   this.blue011consume.getconsumefees(detail).then((data: any) => {
    if(data) {
    this.consumefees = {
      networkfees: Number(data.networkfees) ,
      fixed: Number(data.vendorfeesfixed) + Number(data.partnerfeesfixed),
      percentage:  Number(data.vendorfeespercentage) + Number(data.partnerfeespercentage)
    };

     this.storage.set(environment.storageuniq+'consumefees', this.consumefees);
    }
   });;

}


async loadaccount() {
   this.useraccount = await this.termsuserservice.getuseraccount();
   if(this.useraccount.termsagreed == 'yes') {
     this.feesdisplay = this.blue011issue.getdisplayfees(this.useraccount);
   }

}


async loaduser() {
   this.loggedinuser = await this.termsuserservice.getloggedinuser();
}


loadkycdata() {

   this.storage.get(environment.storageuniq+'kycdata').then((data: kycData)=> {
    this.kycdata = data;
   });

}

show() {

  this.hidden = false;
  setTimeout(()=>{    
      this.hidden = true;
   }, 15000);

}

hide() {
      this.hidden = true;
}

copywif () {
  this.clipboard.copy(this.walletwif);
    this.presentAlert("", "", "WIF copied");
}

copywalletaddress () {
  this.clipboard.copy(this.walletaddress);
    this.presentAlert("", "", "Wallet address copied");
}

clearwif() {
   this.walletwif = ''; 
}

pastewif() {
  this.clipboard.paste().then(
   (resolve: string) => {
     this.walletwif = resolve;
    },
    (reject: string) => {
      alert('Error: ' + reject);
    }
  );

}

createwif() {

  const PrivateKey = dashcore.PrivateKey;
  const privateKey = new PrivateKey();
  this.walletwif = privateKey.toWIF();
  this.wiftoaddress() ;

}


freeze() {

 this.savewif() ;
 this.enableoverwrite = false;
}

wiftoaddress() {
   if(this.walletwif == '') {
    this.presentAlert("", "Wallet wif not set " , "Error code:" + environment.err.W1231.code);
    return;
  }

  try {
  if(this.network == 'testnet') {
  this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif ).toAddress(dashcore.Networks.testnet).toString();
    return 0;
  }else if(this.network == 'livenet') {
  this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif ).toAddress(dashcore.Networks.livenet).toString();
    return 0;
  }else {
    this.presentAlert("", "", " Invalid network " +environment.err.W1231.code);
    return -1;
  }

  } catch (err) {
  
    this.presentAlert("", "", " Invalid WIF provided "+ environment.err.W1231.code);
    return -1;
  }

}

async getkycdata() {

   this.loggedinuser = await this.termsuserservice.getloggedinuser();

   var data = {
     liveaddress: this.walletaddress,
     testaddress: this.walletaddress,
     network: this.network,
     paymentdata: 'null',
     email: this.loggedinuser.email,
     googleid: this.loggedinuser.uid,
     kycid: ''
   };

   this.kycService.getkycdata(data).then((kycdata: kycData) => {
     this.storage.set(environment.storageuniq+'kycdata', kycdata).then(xx=>{
        this.loadkycdata() ;

       });;
   });;


}

async savewif() {
  
   this.loggedinuser = await this.termsuserservice.getloggedinuser();
   this.useraccount = await this.termsuserservice.getuseraccount();


   if(this.loggedinuser == null) {
    this.presentAlert("", "", " Login to save data ");
     this.router.navigateByUrl('/login');

     return;
   }

   if( this.loggedinuser.uid == null || this.loggedinuser.uid == '') {
    this.presentAlert("User not loggedin.", "Login to proceed", "");

     this.router.navigateByUrl('/login');
     return;
   }

   if(this.useraccount.termsagreed == 'no') {
    this.presentAlert("", "", "Agree terms before using ");
    return;
   }

   if(this.wiftoaddress() == -1) {
    this.presentAlert("", "", " Save failed ");
    this.loadoldwif() ;
    return;
   }

   var data = {
     liveaddress: (this.network == 'livenet')?this.walletaddress: '',
     testaddress: (this.network == 'testnet')?this.walletaddress: '',
     network: this.network,
     paymentdata: 'null',
     email: this.loggedinuser.email,
     googleid: this.loggedinuser.uid,
     name: this.loggedinuser.displayName,
     kycid: this.useraccount?this.useraccount.kycid: null
   };

   this.blue011consume.registerwif(data).then((useraccount: any) => {
   this.storage.set(environment.storageuniq+'walletwif', this.walletwif);
   this.wiftoaddress() ;
   this.termsagree();
   this.storage.set(environment.storageuniq+'useraccount', JSON.stringify(useraccount)).then(xx=>{
       this.termsuserservice.reflectuseraccount();

   });;
   
    this.restartwallet() ;
   }).catch((err1)=> {

     console.log(err1._body);
     var err ;
        try {
     err = JSON.parse(err1._body);
        } catch(errx) {

        }
     if(err && err.response) {
     this.presentAlert('Failed to save', err.response.message  ,  environment.err.W1232.code );

    } else {
      this.presentAlert("", "", "Failed to save " +environment.err.W1232.code);
    }

    this.loadoldwif() ;
    // restore old wallet
   })

}


async getaccount() {

   this.loggedinuser = await this.termsuserservice.getloggedinuser();
   console.log("sgsg = " + JSON.stringify(this.loggedinuser));
  
   if(this.loggedinuser.uid == '') {
    this.presentAlert("User not loggedin", "Login to proceed", "Error code:" +environment.err.W1233.code);
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
   },(err) => {
      if(err._body) {
    this.presentAlert("Unable to read account", "Check if you have accepted terms", "Error code: " +environment.err.W1233.code);
    } else {
    this.presentAlert("Unable to read account", "Check if you have accepted terms", "Or Network may be down " );
    }

   });



  }


loadoldwif() {

 this.loadwalletwif() ;

}

loadwalletwif() {
     this.storage.get(environment.storageuniq+'walletwif').then(data=> {
	if(data) {
      this.walletwif = data;
      this.wiftoaddress() ;
        }
        else {
        this.enableoverwrite = true;
//      this.walletwif = null;
       }
     }).catch(err => {
//       this.walletwif = null;
      });
}





getwalletbalance() {

if(!this.walletaddress) {
    this.presentAlert("", "", "Wallet address empty" );
 return;
}

 this.blue011consume.getBalance(this.walletaddress, this.network).then((data: any) => {
      if(data != null)
      {
        this.walletbalance = data;
        this.savewalletbalance(this.walletbalance) ;
      }
      else {
    this.presentAlert("", "", "Balance query failed " +environment.err.W1234.code);
      }
   }, (err)=> {
    this.presentAlert("", "", "Balance query failed " +environment.err.W1234.code);
   });
}


async selfemail() {
 this.loggedinuser = await this.termsuserservice.getloggedinuser();

    if( !this.loggedinuser ) {
    this.presentAlert("User not loggedin.", "Login to proceed", "");
       return;
    }

    if( this.loggedinuser.uid == '') {
    this.presentAlert("User not loggedin.", "Login to proceed", "");
       return;
    }



// Share via email
this.socialSharing.shareViaEmail(this.walletwif, 'Wallet Wif', [this.loggedinuser.email]).then(() => {
  // Success!
}).catch(() => {
  // Error!
});

 }

 createhelp() {
    this.presentAlert("Wallet create ", "Creates random wallet. ", "Create random wallet  or enter your own wallet WIF.Then click Save . ");
 }

 restartwallet() {
    this.presentAlert("Restart wallet ", " ", "For changes to take effect.");
 }

 termsagree() {
    this.presentAlert("Terms of Usage ", "Accept terms after reading.", "Accept safety terms, usage terms. ");
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

async loadwalletbalance() {
   this.walletbalance = await this.termsuserservice.getwalletbalance();
}

savewalletbalance(walletbalance) {
     this.storage.set(environment.storageuniq+'walletbalance', walletbalance ).then(x=>{
         this.termsuserservice.reflectwalletbalance();

     });
}

safetyconfirmation() {

  if(this.copyofwalletkeptsafe && this.wifisprotected && this.knowwalletwifneededforrestore) {
    this.presentAlert("", "", "Updating confirmation. ");
    this.confirmsafety() ;
  }else {
    this.presentAlert("", "", "Confirm safety terms. ");
    return;

  } 

  }
 
  gotologin() {
    this.router.navigateByUrl('/login');
  }


  async accept() {
   this.loggedinuser = await this.termsuserservice.getloggedinuser();

    if( !this.loggedinuser ) {
    this.presentAlert("User not loggedin.", "Login to proceed", "");
       return;
    }

    if( this.loggedinuser.uid == '') {
    this.presentAlert("User not loggedin.", "Login to proceed", "");
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
      this.storage.set(environment.storageuniq+'useraccount', JSON.stringify(this.useraccount) ).then(x=> {
       this.termsuserservice.reflectuseraccount();
       })  ;

     this.storage.set(environment.storageuniq+'token', "MobKey "+ this.useraccount.token);
     }

     this.gotohome() ;

   });;


  }

  confirmsafety() {
   var data = {};
   this.policyService.confirmsafety(data).then((data1: any) => {
      this.getaccount() ;
   });

  }


  gotohome() {

  this.router.navigateByUrl('/welcome');

  }

  clearall () {
   this.storage.clear();
  }

  localsave() {

     this.wiftoaddress() ;

  if(this.network == 'testnet') {

     if(this.walletaddress != this.useraccount.testaddress) {
        this.presentAlert("Save failed", "Test address registered not matching ", "Error code:"+environment.err.W1230.code);
        return;
     }
     this.storage.set(environment.storageuniq+'walletwif', this.walletwif);
        this.presentAlert("", "", "Saved successsfully ");
  } else {
     if(this.walletaddress != this.useraccount.liveaddress) {
        this.presentAlert("Save failed", "Live address registered not matching ", "Error code:" +environment.err.W1230.code);
        return;
     }
     this.storage.set(environment.storageuniq+'walletwif', this.walletwif);
        this.presentAlert("", "", "Saved successsfully ");
   }

}
  

   usdamountChanged( e: any) {
    this.toamount = this.changellyCalls.fromFiatDash(this.toamountusd);
  }

 dashamountChanged( e: any) {
    this.toamount = this.changellyCalls.toSatoshi(this.toamountdash);

  }

  gotokyc() {
    this.router.navigateByUrl('/kycpage');
  }

}
