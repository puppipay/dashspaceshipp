import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ChangellyCalls } from '../../providers/changelly';

import { Blue011IssueService } from '../tab4wallet/blue011.issue.service';
import { FromSatoshiPipe } from '../pipes/fromsatoshi';

import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {environment} from '../config/environment';
import { RecordService } from '../tab4wallet/record.service';
import { PolicyService } from '../tab4wallet/policy.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SocialShareService } from '../../providers/socialshare';
import { Incomeshare } from '../models/incomeshare.model';
import { Router } from '@angular/router';
import { PaydisplaymodalPage } from '../paydisplaymodal/paydisplaymodal.page';

import { kycStatus } from '../models/kycstatus.model';

import { KycService } from '../firebasekyc-page/kyc.service';
import { kycData } from '../models/kycdata.model';
import { TermsuserService } from '../termspage/terms-user.service';
import { Logger } from '../../providers/logger/logger';
import { Networkfees } from '../models/networkfees.model';




declare var dashcore;

@Component({
  selector: 'app-tab3sending',
  templateUrl: 'tab3sending.page.html',
  styleUrls: ['tab3sending.page.scss']
})
export class Tab3sendingPage implements OnInit{

whichdash = (environment.network=='testnet')?'tDASH': 'DASH';

public issued: any;
public whichsegment = "send";
public addressbalance : any;
public sendingmessages = [];
network = environment.network;


public walletbalance: any;
public walletaddress: any;
public walletwif: any;
public reversiblerefid: any;
public toaddress: string = '';
public directpurpose: string = '';
public revertpurpose: string = '';
public toamount: number ;
public revertfees : number;
public directfees : number;
public toamountusd: number ;
public toamountdash: number ;
public torevertamount: number = 0.000;
public torevertamountdash: number ;
public enteringindash: boolean;
public yettodepositfund: boolean = false;
public txid: string = '';
public directtxid: string = '';
kycstatus: kycStatus;
useraccount : any = {
     termsagreed: 'no'
  } ;

loggedinuser : any = {
        uid: '',
        displayName: '',
        photoURL : '',
        phoneNumber: '',
        email: '',
        emailVerified: ''
      };
;
 
   sendnetworkfeeschange : Networkfees = {
     increase: false,
     decrease: false
  };


constructor(
	private blue011issue: Blue011IssueService,
	private socialshareservice: SocialShareService,
	private alertController: AlertController,
	private modalController: ModalController,
	private socialSharing: SocialSharing,
	private changellyCalls: ChangellyCalls,
	private recordService: RecordService,
        private logger: Logger,

	private policyService: PolicyService,
        private kycService: KycService,
        public termsuserservice: TermsuserService,
        private router: Router,
        private clipboard: Clipboard,
	private storage: Storage

  ) {
  this.issued = {
    "id": "",
    "message": "",
    "pin": "",
    "address": "",
    "network": "",
    "shorturl": "",
    "encshorturl": "",
    "type": "",
    };

   this.walletbalance = {
            address: '',
            balance: 0,
            balanceSat: 0,
            unconfirmedBalance:0,
            unconfirmedBalanceSat:0
     };

   this.enteringindash = false;
   
    this.storage.get(environment.storageuniq+'sendnetworkfeeschange').then(data=> {
        if(data) {
        this.sendnetworkfeeschange = data;
        } 
     });

}


ionViewWillEnter() {
  this.loadwalletwif() ;
  this.loaduser() ;
  this.loadaccount() ;
  this.loadkycdata() ;
  this.getaccount() ;
  this.loadwalletbalance() ;
  this.loadsendingmessages() ;

}

ngOnInit() {
  this.loadwalletwif() ;
  this.loaduser() ;
  this.loadaccount() ;
  this.loadkycdata() ;

  this.loadwalletbalance() ;

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

}


async getaccount() {

  this.loggedinuser = await this.termsuserservice.getloggedinuser();

   if(this.loggedinuser.uid == '') {
    this.presentAlert("", "", "User need to login. ");
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
    this.presentAlert("", "", "Error connecting. ");
    } else {
    this.presentAlert("", "", "Error reading account. ");
    }

   });



  }


async loaduser() {
  this.loggedinuser = await this.termsuserservice.getloggedinuser();

}

async  loadaccount() {

   this.useraccount = await this.termsuserservice.getuseraccount();

 }



 usdamountChanged( e: any) {
    this.toamount = this.changellyCalls.fromFiatDash(this.toamountusd);
    var incomeshare: Incomeshare = this.blue011issue.getdirectincomeshare("directsend", Number(this.toamount), this.useraccount);
    var fees = this.blue011issue.getnetworkfees("directsend", Number(this.toamount), this.sendnetworkfeeschange, this.useraccount); //   Number(this.useraccount.networkfees); //15000;
    this.directfees = Number(incomeshare.incomeamount) + fees;
  }

 dashamountChanged( e: any) {
    this.toamount = this.changellyCalls.toSatoshi(this.toamountdash);

    var incomeshare: Incomeshare = this.blue011issue.getdirectincomeshare("directsend", Number(this.toamount), this.useraccount);
    var fees = this.blue011issue.getnetworkfees("directsend", Number(this.toamount), this.sendnetworkfeeschange, this.useraccount); //   Number(this.useraccount.networkfees, this.useraccount); //15000;
    //var fees = Number(this.useraccount.networkfees); //15000;
    this.directfees = Number(incomeshare.incomeamount) + fees;
  }

 dashrevertamountChanged( e: any) {
    this.torevertamount = this.changellyCalls.toSatoshi(this.torevertamountdash);
    var incomeshare: Incomeshare = this.blue011issue.getrevertincomeshare("revertsend", Number(this.torevertamount), this.useraccount);
    var fees = this.blue011issue.getnetworkfees("revertsend", Number(this.torevertamount), this.sendnetworkfeeschange, this.useraccount); //   Number(this.useraccount.networkfees); //15000;
    //var fees = Number(this.useraccount.networkfees); //15000;
    this.revertfees = Number(incomeshare.incomeamount) + fees;
  }

 loadkycdata() {

   this.storage.get(environment.storageuniq+'kycstatus').then((data: any)=> {
      if(data) { this.kycstatus = data;
      }
   });

}


loadwalletwif() {
     this.storage.get(environment.storageuniq+'walletwif').then(data=> {
        if(data) {
      this.walletwif = data;
      this.wiftoaddress() ;
      this.loadwalletbalance() ;
        } else {
       this.presentAlert("", "", "Set wallet before use. ");
//         this.router.navigateByUrl('/login');

        }
     });

}

async loadwalletbalance() {
   this.walletbalance = await this.termsuserservice.getwalletbalance();
}

savewalletbalance(walletbalance) {
   this.storage.set(environment.storageuniq+'walletbalance', walletbalance ).then(x=>{
         this.termsuserservice.reflectwalletbalance();

     });

}



pastesendaddress() {
  this.clipboard.paste().then(
   (resolve: string) => {
     this.toaddress = resolve; 
    },
    (reject: string) => {
      alert('Error: ' + reject);
    }
  );

}


wiftoaddress() {


 if(this.network == 'testnet') {
  this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif ).toAddress(dashcore.Networks.testnet).toString();
  }else if(this.network == 'livenet') {
  this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif ).toAddress(dashcore.Networks.livenet).toString();
  }else {
    this.presentAlert("", "", "Invalid network ");
  }



}



async generateissuedaddress() {

  this.loggedinuser = await this.termsuserservice.getloggedinuser();

if(this.loggedinuser.email == '') {
    this.presentAlert("", "", "User need to login. ");
    return;
}

if(!this.useraccount.kycid) {
    this.presentAlert("", "", "Login to use " );
 return;
}

    var data = {
      kycid: this.useraccount.kycid,
      email: this.loggedinuser.email,
      msgtype: "default",
      network: "testnet"
    }

 if(this.network == 'testnet') {
    data = {
      email: this.loggedinuser.email,
      kycid: this.useraccount.kycid,
      msgtype: "default",
      network: "testnet"
    };
 } else {
    data = {
      email: this.loggedinuser.email,
      kycid: this.useraccount.kycid,
      msgtype: "default",
      network: "livenet"
    };

 }

 try {

   this.blue011issue.issuesendingmessage(data).then((data: any) => {
      if(data != null)
      {
        this.issued = data;
        this.yettodepositfund = true;

    this.issued.id = this.issued.address.substr(-5) ; 
    this.issued.status = 'issued'; 
    this.issued.balance = 0; 
    this.blue011issue.savesendingmessage(this.issued);
      }
      else {
    this.presentAlert("", "", "Error creating escrow " );
      }
   }, (err)=> {
    this.presentAlert("", "", "Error creating escrow " + err);
   });

  } catch (err) {

    this.presentAlert("Create escrow failed", "",  err);

  }
}


getaddressbalance() {

if(!this.issued.address) {
    this.presentAlert("", "", "Escrow address field empty " );
 return;
}

 this.blue011issue.getBalance(this.issued.address, this.network).then((data: any) => {
      if(data != null)
      {
        this.addressbalance = data;
      }
      else {
    this.presentAlert("", "", "Balance query failed" );
      }
   }, (err)=> {
    this.presentAlert("", "", "Balance query failed" + err );
   });
}

getwalletbalance() {

if(this.walletaddress == null || this.walletaddress == ''  ) {
    this.presentAlert("", "", "Wallet address empty " );
 return;
}

 this.blue011issue.getBalance(this.walletaddress, this.network).then((data: any) => {
      if(data != null)
      {
        this.walletbalance = data;
        this.savewalletbalance(this.walletbalance);
      }
      else {
    this.presentAlert("", "", "Balance query failed " );
      }
   }, (err)=> {
    this.presentAlert("", "", "Balance query failed "+err );
   });
}

getescrowbalance(msg) {

if(msg.address == null || msg.address == ''  ) {
    this.presentAlert("", "", "Address empty " );
 return;
}

 this.blue011issue.getBalance(msg.address, this.network).then((data: any) => {
      if(data != null)
      {
        msg.balance =  Number(data.balanceSat);
       this.blue011issue.balanceupdatesendingmessage(msg);
       this.loadsendingmessages() ;
      }
   }, (err)=> {
    this.presentAlert("", "", "Balance query failed "+err );
   });
}



loadsendingmessages() {


   this.blue011issue.getsendingmessages().then((data: any) => {
      if(data)
      {
        this.sendingmessages = data;
      }
      else {
//        alert("Load failed");
      }
   }, (err)=> {
    this.presentAlert("", "", err );
   });

}

async senddirectpayment() {
  
  this.useraccount = await this.termsuserservice.getuseraccount();

 if(this.directpurpose == '') {

    this.presentAlert("", "", "Mention purpose ");
    return;
 }

 if(this.useraccount == null) {
    this.presentAlert("", "", "User not loggedin ");
    return;
 }
 
 if(this.useraccount.termsagreed == 'no') {
    this.presentAlert("", "", "Agree terms before using ");
    return;
 }

 if(this.network == 'testnet') {
  if(!dashcore.Address.isValid(this.toaddress, dashcore.Networks.testnet)) {
    this.presentAlert("", "", "Invalid address ");
    return;
  }
 } else {
  if(!dashcore.Address.isValid(this.toaddress, dashcore.Networks.livenet)) {
    this.presentAlert("", "", "Invalid address ");
    return;
  }

 }
 

// this.toamount = Number(this.changellyCalls.fromFiatDash(this.toamountusd).toFixed());

 var incomeshare: Incomeshare = this.blue011issue.getdirectincomeshare("directsend", Number(this.toamount), this.useraccount);

 if(this.toamount > (this.walletbalance.balanceSat - this.directfees)) {
    this.presentAlert("", "", "Amount specified greater than balance");
    return;
 }

 var policystatus ;

 policystatus = this.policyService.check("minimumsend", this.toamount);
 if(policystatus.code == -1) {
    this.presentAlert("", "", policystatus.message );
    return;
 }

 if(this.useraccount.kycdone  != 'yes') {
 policystatus = this.policyService.check("kyclimitnokyc", this.toamount);
 if(policystatus.code == -1) {
    this.presentAlert("", "", policystatus.message );
    return;
 }
 }


 if(this.useraccount.kycdone  == 'yes') {
 policystatus = this.policyService.check("maximumlimitkyc", this.toamount);

 if(policystatus.code == -1) {
    this.presentAlert("", "", policystatus.message );
    return;
 }
 
 }
 

 try {

 this.blue011issue.getUtxo(this.walletaddress, this.network).then((data: any) => {
// var fees = Number(this.useraccount.networkfees); //15000;
  var fees = this.blue011issue.getnetworkfees("directsend", Number(this.toamount), this.sendnetworkfeeschange, this.useraccount); //   Number(this.useraccount.networkfees); //15000;
 if(data.length == 0){
    this.presentAlert("", "", "No utxo amount to spend ");
    return;
 }
 var utxo = data;
 var privatekey = dashcore.PrivateKey.fromWIF(this.walletwif);
 var changeaddress = this.walletaddress;

 var myuseraccount = this.useraccount;

    var tx = this.blue011issue.createtransaction(utxo, privatekey,changeaddress, this.toaddress, Number(Number(this.toamount).toFixed(0)),fees , incomeshare, myuseraccount) ;

    if(!tx) {
     this.presentAlert("", "", "Create transaction failed");
     return;
    }

    this.blue011issue.broadcast(tx.toString('hex'), this.network).then((res: any) => {
      if(res) {
        this.directtxid = res.txid;
        var refid= this.toaddress.substr(-5);
        // alert(refid);
        var trandata = {
            reversible: false,
            id: refid,
            txid: this.directtxid,
            fromaddress: this.walletaddress,
            toaddress: this.toaddress,
            amount: Number(this.toamount),
            fees: fees
        };

       this.blue011issue.savesendtransaction(trandata);
       var directdata = {
            data: trandata, 
            amount: trandata.amount ,
            fees: trandata.fees ,
            txid: trandata.txid ,
            purpose: this.directpurpose,
            address: trandata.toaddress ,
       };

       this.recordService.recorddirectsend(directdata);

      }
    });

  });

  } catch(err) {

    this.presentAlert("Sending failed", "", err );
  
  }
}


async sendreversiblepayment() {

  this.useraccount = await this.termsuserservice.getuseraccount();


 if(this.revertpurpose == '') {

    this.presentAlert("", "", "Mention purpose ");
    return;
 }

 if(this.useraccount == null) {

    this.presentAlert("", "", "User not loggedin ");
    return;
 }

  if(this.useraccount.termsagreed == 'no') {
    this.presentAlert("", "", "Agree terms before using ");
    return;
 }


 if(this.torevertamount > (this.walletbalance.balanceSat - this.revertfees)) {
    this.presentAlert("", "", "Amount specified greater than balance");
    return;
 }

 var policystatus ;

policystatus = this.policyService.check("reverseminimumsend", this.torevertamount);
 if(policystatus.code == -1) {
    this.presentAlert("", "", policystatus.message );
    return;
 }


 if(this.useraccount.kycdone  != 'yes') {
 policystatus = this.policyService.check("kyclimitnokyc", this.torevertamount);
 if(policystatus.code == -1) {
    this.presentAlert("", "", policystatus.message );
    return;
 }
 }


 try {

 this.blue011issue.getUtxo(this.walletaddress, this.network).then((data: any) => {
  var fees = this.blue011issue.getnetworkfees("revertsend", Number(this.torevertamount), this.sendnetworkfeeschange, this.useraccount); //   Number(this.useraccount.networkfees); //15000;
 var utxo = data;
 var privatekey = dashcore.PrivateKey.fromWIF(this.walletwif);
 var changeaddress = this.walletaddress;

 var incomeshare: Incomeshare = this.blue011issue.getrevertincomeshare("reversiblesend", Number(this.torevertamount), this.useraccount);
 var myuseraccount = this.useraccount;
    var tx = this.blue011issue.createtransaction(utxo, privatekey,changeaddress, this.issued.address, Number(Number(this.torevertamount).toFixed(0)),fees , incomeshare, myuseraccount) ;

    this.blue011issue.broadcast(tx.toString('hex'), this.network).then((res: any) => {
      if(res) {
        this.txid = res.txid;
        var trandata = {
            reversible: true,
            id: this.issued.address.substr(-5),
            txid: this.txid,
            fromaddress: this.walletaddress,
            toaddress: this.issued.address,
            amount: Number(this.torevertamount),
            fees: fees
        };

       this.yettodepositfund = false;
       this.blue011issue.updatesendingmessage(trandata);

       this.blue011issue.savesendtransaction(trandata);
         var issuerdata = {
            data: trandata,
            amount: trandata.amount ,
            fees: trandata.fees ,
            txid: trandata.txid ,
            purpose: this.revertpurpose,
            address: trandata.toaddress ,
       };

       this.recordService.recordissuersend(issuerdata);
       this.loadsendingmessages() ;

      }
    });

  });

  } catch(err) {

    this.presentAlert("Sending failed", "", err );
  
  }
}

sharedirectsend() {

   try {
   var message = "A payment of "+ this.changellyCalls.fromSatoshi(this.toamount) + " DASH " + " is sent to address "+ this.toaddress + " txid is " + this.directtxid;

   return this.socialshareservice.socialSharingAnything(message, null, null);
   } catch (err) {

     alert("Error sharing "+ err);
   }

}

sharecontract() {

   var message = this.issued.message;

   return this.socialshareservice.socialSharingAnything(message, null, null);

}

sharepin() {

   var message = this.issued.pin;

   return this.socialshareservice.socialSharingAnything(message, null, null);

}


sharereversiblepaymentlink() {

   var message = "A payment of "+ this.changellyCalls.fromSatoshi(this.torevertamount) + " DASH " + " is sent in link on "+ Date().toString()+". It expires in 4 days. Use PIN to accept."  ;

   return this.socialshareservice.socialSharingAnything(message, null, this.issued.encshorturl);
}

shareold(msg) {

   var message = " Contract: "+ msg.message + "\r\n" + " PIN: " + msg.pin + "\r\n" + " Escrow address: " + msg.address ;

   return this.socialshareservice.socialSharingAnything(message, null, null);

}

reversepayment(msg) {

  var xx = {
   message: msg.message, 
   pin: msg.pin, 
  };

    this.storage.set(environment.storageuniq+'forreverse', xx ).then(ss=> {

      this.router.navigateByUrl('/tabs/tab3');

    });
//    this.router.navigate(['/tabs/tab3', msg.message,msg.pin]);
}

deleteold(index) {
     this.blue011issue.deletemessage(index).then(ss=> {
       this.loadsendingmessages() ;
        this.presentAlert('', '', "Deleted");

     });
}

refresh() {
     this.loadsendingmessages() ;
     this.presentAlert('', '', "Refreshed");

}

clearall() {

     this.blue011issue.deleteallmessage().then(xx=> {
       this.loadsendingmessages() ;
       this.presentAlert('', '', "Cleared");

     });
}

trysharing() {
// Check if sharing via email is supported
this.socialSharing.canShareViaEmail().then(() => {
  // Sharing via email is possible
  this.nowshare();
}).catch(() => {
  // Sharing via email is not possible
});

}


nowshare() {
// Share via email
this.socialSharing.shareViaEmail('Body', 'Subject', ['']).then(() => {
  // Success!
}).catch(() => {
  // Error!
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
   }, 2000);

  }
 
  async sharepaymentqrcode() {

    if(!this.walletaddress) {
      alert("Wallet address is empty");
      return;
    }

    var mix = {
     message: this.issued.message,
     pin: this.issued.pin,
    }
    try {
    var item = {
        displayq: 'dash',
        addresstoverify: this.issued.address,
        title: 'Payment QRcode',
        topmessage: ' with amount '+ this.changellyCalls.fromSatoshi(this.torevertamount) + ' DASH',
        messagepin: JSON.stringify(mix),
        bottommessage: 'Protected with PIN'
    };
    const modal = await this.modalController.create({
      component: PaydisplaymodalPage,
      componentProps: { obj: item }
    });
    return await modal.present();
    } catch (err) {
	alert ("Error"+err);
    }
  }



}
