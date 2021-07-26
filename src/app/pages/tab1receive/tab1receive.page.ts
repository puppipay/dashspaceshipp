import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ChangellyCalls } from '../../providers/changelly';

import { ActivatedRoute } from '@angular/router';
import { FromSatoshiPipe } from '../pipes/fromsatoshi';

import { RecordService } from '../tab4wallet/record.service';
import { Blue011ConsumeService } from '../tab4wallet/blue011.consume.service';
import { Blue011IssueService } from '../tab4wallet/blue011.issue.service';
//import * as dashcore from '@dashevo/dashcore-lib'
//import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import {environment} from '../config/environment';
import { QrdisplaymodalPage } from '../qrdisplaymodal/qrdisplaymodal.page';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

import { kycStatus } from '../models/kycstatus.model';

import { TermsuserService } from '../termspage/terms-user.service';
import { KycService } from '../firebasekyc-page/kyc.service';
import { kycData } from '../models/kycdata.model';

import { Logger } from '../../providers/logger/logger';





declare var dashcore;

@Component({
  selector: 'app-tab1receive',
  templateUrl: 'tab1receive.page.html',
  styleUrls: ['tab1receive.page.scss']
})
export class Tab1receivePage implements OnInit{

 whichdash = (environment.network=='testnet')?'tDASH': 'DASH';


public revertible : any;
public transacted : any;
public walletbalance: any;
public walletaddress: any;
public purpose: string = '';
public walletwif: any;
public toaddress: string;
public toamount: number;
public receivedmessages = [];
network = environment.network;
scannedData: any;


public whichsegment = "receive";


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

kycstatus: kycStatus;

constructor(
	private storage: Storage,
	private changellyCalls: ChangellyCalls,
//        private qrScanner: QRScanner,
	private blue011issue: Blue011IssueService,
        public termsuserservice: TermsuserService,
        private kycService: KycService,
	private recordService: RecordService,
        private route: ActivatedRoute,
        private modalController: ModalController,
        private logger: Logger,

        public barcodeCtrl: BarcodeScanner,
        public alertController: AlertController,
        private clipboard: Clipboard,
	private blue011consume: Blue011ConsumeService

  ) {


  this.loadaccount() ;
}



async getaccount() {
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


     ;
     this.storage.set(environment.storageuniq+'token', "MobKey "+ this.useraccount.token);

     }
   } ,(err) => {
      if(err._body) {
    this.presentAlert("", "", "Error connecting.");
    } else {
    this.presentAlert("", "", "Error reading account. ");
    }

   });



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

async loadaccount() {
   this.useraccount = await this.termsuserservice.getuseraccount();

}


async loaduser() {
   this.loggedinuser = await this.termsuserservice.getloggedinuser();

}



goToBarcodeScan() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a barcode inside the scan area',
      resultDisplayDuration: 500,
      formats: 'QR_CODE,PDF_417 ',
      orientation: 'landscape',
    };

    this.barcodeCtrl.scan(options).then(barcodeData => {
      this.logger.info('Barcode data', barcodeData);
     var readdata:any = 0; 
     try {
      readdata =  JSON.parse(barcodeData.text);
     } catch (err) {
        alert("Invalid QRcode")
        return ;

     }
    
     this.revertible.message = readdata.message;
     this.revertible.pin = readdata.pin;

    }).catch(err => {
      this.logger.info('Error', err);
    });
  }



copyaddress () {
  this.clipboard.copy(this.walletaddress);
    this.presentAlert('', '', "Copied");
}

pastecontract() {
  this.clipboard.paste().then(
   (resolve: string) => {
     this.revertible.message = resolve;
    },
    (reject: string) => {
      alert('Error: ' + reject);
    }
  );

}

pastepin() {
  this.clipboard.paste().then(
   (resolve: string) => {
     this.revertible.pin = resolve;
    },
    (reject: string) => {
      alert('Error: ' + reject);
    }
  );

}



ngOnInit() {

  this.loaduser() ;
//  this.loaduseraccount() ;
  this.loadkycdata() ;
  this.loadaccount() ;



 this.transacted = {
    "txid": "",
    "amount": "",
    "fromaddress": "",
    "toaddress": "",
  };

 this.revertible = {
    "id": "",
    "message": "",
    "pin": "",
    "address": "",
    "email": "",
    "target": "",
    "kycstatus": "",
    "network": "",
    "type": "BLUE011",
    };

   this.walletbalance = {
            address: '',
            balance: 0,
            balanceSat: 0,
            unconfirmedBalance:0,
            unconfirmedBalanceSat:0
     };

 this.loadwalletwif() ;
  this.loadwalletbalance() ;

 this.forreverse() ;
}

forreverse() {
  this.storage.get(environment.storageuniq+'forreverse').then(xx=> {
    if(xx) {
    this.revertible.message = xx.message;
    this.revertible.pin = xx.pin;
    this.storage.set(environment.storageuniq+'forreverse', null);
    }
  });
}


 loadkycdata() {

   this.storage.get(environment.storageuniq+'kycstatus').then((data: any)=> {
      if(data) this.kycstatus = data;
   });

}


async presentAlert(header,subheader, message) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subheader,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
    setTimeout( async ()=>{
      await alert.dismiss();
   }, environment.alertdelay);
}


ionViewWillEnter() {
  this.loadwalletwif() ;
  this.loaduser() ;
//  this.loaduseraccount() ;
  this.loadkycdata() ;
  this.getaccount() ;
  this.loadwalletbalance() ;

  this.forreverse() ;
  let contract = this.route.snapshot.paramMap.get('contract');
  let pin = this.route.snapshot.paramMap.get('pin');

  if(contract && pin) {
    this.revertible.message = this.decryptcontract(contract, "pinforuse") ;
    this.revertible.pin = pin;
    this.presentAlert('', '', "Accept funds from escrow");
  }else if(contract) {
    this.revertible.message = this.decryptcontract(contract, "pinforuse") ;
    this.presentAlert('', '', "Enter PIN and accept funds");
  }

  this.loadreceivedmessages() ;
}

decryptcontract(contract, pin) {
  var data;

  try {
     data = this.changellyCalls.decryptcontract(contract, pin);
     return data;
    } catch (err) {
     this.presentAlert('', '', "Invalid data "+ environment.err.W1224.code);
     return null;
   }

}


wiftoaddress() {

 if(this.network == 'testnet') {
  this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif ).toAddress(dashcore.Networks.testnet).toString();
  }else if(this.network == 'livenet') {
  this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif ).toAddress(dashcore.Networks.livenet).toString();
  }else {
     this.presentAlert('', '', "Invalid network " + environment.err.W1223.code);
  }



}

/*
sendpayment() {

 this.blue011issue.getUtxo(this.walletaddress, this.network).then((data: any) => {
 var fees = 15000;
 var utxo = data;
 var privatekey = dashcore.PrivateKey.fromWIF(this.walletwif);
 var changeaddress = this.walletaddress;
 
    var tx = this.blue011issue.createtransaction(utxo, privatekey,changeaddress, this.toaddress, Number(this.toamount),fees ) ;

    this.blue011issue.broadcast(tx.toString('hex'), this.network).then(res => {
    
    // alert(res);

    });

  });
}
*/

loadwalletwif() {
     this.storage.get(environment.storageuniq+'walletwif').then(data=> {
        if(data) {
      this.walletwif = data;
      this.wiftoaddress() ;
      this.loadwalletbalance() ;
        }
        else {

        this.presentAlert('', '', "Set your wallet before use " + environment.err.W1222.code);
         // this.router.navigateByUrl('/tabs/tab4');

      }

     });

}


async consumemessage() {

   this.loggedinuser = await this.termsuserservice.getloggedinuser();

   if(this.loggedinuser.uid == '') {
     return;
   }

 if(!this.loggedinuser.email || this.loggedinuser.email == ''){

  this.presentAlert('', '', "Login to use " + environment.err.W1221.code);
  return;
}


 this.useraccount = await this.termsuserservice.getuseraccount();

 if(this.useraccount.termsagreed == 'no') {
    this.presentAlert("", "", "Agree terms before using ");
    return;
 }


if(this.purpose == '') {
     this.presentAlert('', '', "Mention purpose " + environment.err.W1221.code);
 return;
}


if(!this.revertible.message) {
     this.presentAlert('', '', "Contract field empty " + environment.err.W1221.code);
 return;
}

if(!this.revertible.pin) {
     this.presentAlert('', '', "PIN field empty "+ environment.err.W1221.code);
 return;
}

this.revertible.kycstatus = this.useraccount.kycdone;


/*
not needed as it is base64
var data;

try {
     data = JSON.parse(this.revertible.message );
    } catch (err) {
  this.decryptcontract(this.revertible.message, this.revertible.pin);
}

try {
     data = JSON.parse(this.revertible.message );
    } catch (err) {
  
   return;
}
*/


this.revertible.target = this.walletaddress;

this.revertible.network = this.network;
this.revertible.email = this.loggedinuser.email;

if(!dashcore.Address.isValid(this.revertible.target, this.network)) {
  this.presentAlert('', '', "Invalid receive address provided " + environment.err.W1221.code);
 return;

}



this.revertible.id = this.revertible.address.substr(this.revertible.address.length -5) ;

 this.blue011consume.savereceivedmessage(this.revertible);

 this.blue011consume.consumemessage(this.revertible).then((data1: any) => {
      if(data1 != null)
      {
        var data;
      
         if(typeof data1 == 'string') {
           this.presentAlert('', data1, "Error processing Request " + environment.err.W1221.code );
          return;
         } else {
            data = data1;
         }


        if(data.error)
        {
           this.presentAlert('', '', "Error processing Request " + environment.err.W1221.code );
	   return;
        }
        this.transacted = data;
        this.blue011consume.savereceivetransaction(this.transacted);

       this.blue011consume.updatereceivedmessage(this.revertible, this.transacted);

        var receive = {
            data: this.transacted,
            amount: this.transacted.amount ,
            fees: this.transacted.fees ,
            txid: this.transacted.txid,
            purpose: this.purpose,
            id: this.transacted.fromaddress.substr(-5),
            address: this.transacted.fromaddress,
       };

        this.recordService.recordreceive(receive);

        this.loadreceivedmessages() ;
      }
      else {
     this.presentAlert('', '', " Receive funds failed " + environment.err.W1221.code);
      }
   }, (err1)=> {
     console.log(err1._body);
     var err ;
        try {
     err = JSON.parse(err1._body);
        } catch(errx) {

        }
     if(err && err.response) {
     this.presentAlert('Receive funds failed', err.response.message  ,  environment.err.W1221.code );
     } else {

     this.presentAlert('Receive funds failed', 'Error', environment.err.W1221.code );
     }
   });


}

 
getwalletbalance() {

if(!this.walletaddress) {
     this.presentAlert('', '', "Address field empty " + environment.err.W1220.code );
 return;
}

 this.blue011consume.getBalance(this.walletaddress, this.network).then((data: any) => {
      if(data != null)
      {
        this.walletbalance = data;
        this.savewalletbalance(this.walletbalance) ;
      }
      else {
       this.presentAlert('', '', "Balance check failed  "+ environment.err.W1220.code);
      }
   }, (err)=> {
       this.presentAlert('Get balance failed', 'Error', environment.err.W1220.code );
   });
}

refresh() {
  this.loadreceivedmessages() ;
       this.presentAlert('', '', 'Refreshed' );
}


loadreceivedmessages() {


   this.blue011consume.getreceivedmessages().then((data: any) => {
      if(data != null)
      {
        this.receivedmessages = data;
      }
      else {
//        alert("Load failed");
      }
   }, (err)=> {
       this.presentAlert('', '', err );
   });

}

clearall() {

    this.blue011consume.deleteallmessage();
    this.presentAlert('', '', "Cleared");
}


scanqrcode() {
// not used as it conflicts with barcode 
/*
  // Optionally request the permission early
this.qrScanner.prepare()
  .then((status: QRScannerStatus) => {
     if (status.authorized) {
       // camera permission was granted


       // start scanning
       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
         this.logger.info('Scanned something', text);

         this.qrScanner.hide(); // hide camera preview
         scanSub.unsubscribe(); // stop scanning
       });
       this.qrScanner.show();

     } else if (status.denied) {
       // camera permission was permanently denied
       // you must use QRScanner.openSettings() method to guide the user to the settings page
       this.qrScanner.openSettings() ;
       // then they can grant the permission from there
     } else {
       // permission was denied, but not permanently. You can ask for permission again at a later time.
     }
  })
  .catch((e: any) => this.logger.info('Error is', e));

*/

}


   async presentModalDash() {
    var item = {
        displayq: 'dash',
        addresstodeposit: this.walletaddress,
        title: 'Address to deposit',
        topmessage: 'Deposit DASH',
        bottommessage: ''
    };

    const modal = await this.modalController.create({
      component: QrdisplaymodalPage,
      componentProps: { obj: item }
    });
    return await modal.present();
  }



async loadwalletbalance() {
     this.walletbalance = await this.termsuserservice.getwalletbalance();

}

savewalletbalance(walletbalance) {
    this.storage.set(environment.storageuniq+'walletbalance', walletbalance ).then(x=>{
         this.termsuserservice.reflectwalletbalance();

     });

}


}
