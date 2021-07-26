import { Component  , ViewChild} from "@angular/core";
import { MenuController, NavController,Platform,   ModalController,   AlertController, LoadingController } from '@ionic/angular';


//import { HelpPage } from '../helppage/helppage';
import { ChangellyCalls } from '../../providers/changelly';
//import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { FromSatoshiPipe } from '../pipes/fromsatoshi';
import { Events } from '@ionic/angular';

import {NgxQRCodeComponent} from 'ngx-qrcode2';
import {QRCodeComponent} from 'angularx-qrcode';
import { QrdisplaymodalPage } from '../qrdisplaymodal/qrdisplaymodal.page';

import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';


import { Clipboard } from '@ionic-native/clipboard/ngx';

//import { ShareButtons } from '@ngx-share/core';
import { PlatformProvider } from '../../providers/platform/platform';
import { Logger } from '../../providers/logger/logger';
import { Networkfees } from '../models/networkfees.model';
import { Sendusechoice } from '../models/senduserchoice.model';
import { ChangellyTranService } from './changellytran';

import { WebView } from '@ionic-native/ionic-webview/ngx';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { TermsPage } from '../termspage/termspage';

import { Storage } from '@ionic/storage';
import { environment } from '../config/environment';
import { Blue011ConsumeService } from '../tab4wallet/blue011.consume.service';
import { Blue011IssueService } from '../tab4wallet/blue011.issue.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { AngularFireAuth } from '@angular/fire/auth';

import { TermsuserService } from '../termspage/terms-user.service';

import { Router } from '@angular/router';


  
let network = environment.network;

declare var dashcore;


/*
- added listener, remover
- effecting userinfo
- when using if useinfo not present, block

*/


@Component({
  selector: 'welcome-page',
  templateUrl: 'welcome.html',
  styleUrls: ['welcome.scss']

})
export class WelcomePage {

  testvalue: any;
  sendnetworkfeeschange : Networkfees = {
     increase: false,
     decrease: false
  };

  senduserchoice : Sendusechoice = {
     starplan: false,
     galaxyplan: false,
     standardplan: true,
     discountplan: false

  }

  whichdash = (environment.network=='testnet')?'tDASH': 'DASH';
  
  @ViewChild (NgxQRCodeComponent, {static: false}) myqr: any;
  @ViewChild(QRCodeComponent,  {static: false}) qrcodechild: QRCodeComponent;

  serverlessWallet : any;
  loading: any;
  relationship = 'bitcoin';

  fromcoin : any;
  fromamount : any;
  depositaddress : any;
  depositcoin : any;
  ethaddress : any;
  bchaddress : any;
  btcaddress : any;

  refreshEnable : any;
  donationgiven = 0;
  fromethamount  = 0;
  ethexchangeamount = 0  ;

  frombtcamount = 0;   
  btcexchangeamount = 0;

  frombchamount = 0 ; 
  bchexchangeamount = 0 ;

  displayq = 'none';
  minimumdeposit : any;
  public walletbalance: any;
public walletaddress: any = null;
public walletwif: any;

  title = 'app';
  elementType = 'url';
  value = 'Techiediaries';

  network: string = network;
  pagesubscribed : boolean = false;
  bitcoinerror : any;
  unlockmodal: any;
  onboardmodal: any;
  loginmodal: any;

  dashcoinerror : any;
  sendingset: any;
  messageforpayment ="Use this";
  description ="descrition";
  errordata: any;
  isCordova: boolean;
  pause6min : any;
  sendaddress= '';
  bitcoinwalletbalance: any;
  //dashcoinwalletbalance: any;
  selectcoinmodal: any;
  madein = "/assets/imgs/91springlogo.png";
  sendqrcode= '';
  paymentdata: any;
  walletlocked = false;
  modal: any;
  bitcoinwallet: any;
  dashcoinwallet: any;
  addresstoreceive='';
  amounttosend=0;
  user: any;
  loggedIn : any;
  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;
  useraccount : any = {
     termsagreed: 'no',
     activeitems: {
       star: false,
       galaxy: false,
       discount: false,
     }
  } ;

  depositid: string; 

  loggedinuser : any = {
        uid: '',
        displayName: '',
        photoURL : '',
        phoneNumber: '',
        email: '',
        emailVerified: ''
      };

   feesdisplay : any = {
  stddiscountfeesdisp: '',
  stdgalaxyfeesdisp: '',
  stdstarfeesdisp: '',
  stdfeesdisp: 'For regular users',
  rvtdiscountfeesdisp: '',
  rvtgalaxyfeesdisp: '',
  rvtstarfeesdisp: '',
  rvtfeesdisp: '',
  networkfees: '',
  };

  constructor(public navCtrl: NavController,  public modalCtrl: ModalController, 
    public changellyCalls: ChangellyCalls,
    public changellyTranService: ChangellyTranService,
    private blue011issue: Blue011IssueService,
    public alertController: AlertController,
    private blue011consume: Blue011ConsumeService,
    private fireauth: AngularFireAuth, private router: Router,
    public events: Events,
    private modalController: ModalController,
    public file: File,
    private filePath: FilePath,
    private storage: Storage,
    public menu: MenuController,
     public termsuserservice: TermsuserService,

    private webview: WebView,
    private barcodeScanner: BarcodeScanner,
    private logger: Logger,
    private platformProvider: PlatformProvider,   
    public plt: Platform,
    private clipboard: Clipboard,

    public socialSharing: SocialSharing,

    public loadingCtrl: LoadingController) {

    this.refreshEnable = true;
    this.bitcoinerror  = '';
    this.dashcoinerror = '';
  
    this.testvalue = {
	supervalue : 'test'
    };
    
    this.fromethamount  = 0;

    this.pause6min = false;
    this.encodeData = "https://www.FreakyJolly.com";

    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };

     this.storage.get(environment.storageuniq+'sendnetworkfeeschange').then(data=> {
        if(data) {
        this.sendnetworkfeeschange = data;
        } else {
          this.storage.set(environment.storageuniq+'sendnetworkfeeschange',this.sendnetworkfeeschange);
        }
     });


     this.storage.get(environment.storageuniq+'senduserchoice').then(data=> {
        if(data) {
        this.senduserchoice = data;
        } else {
          this.storage.set(environment.storageuniq+'senduserchoice',this.senduserchoice);
        }
       this.blue011issue.reflectsenduserchoice();
     });


     this.walletbalance = {
            address: '',
            balance: 0,
            balanceSat: 0,
            unconfirmedBalance:0,
            unconfirmedBalanceSat:0 
     };
    this.errordata = {
        message: ''
      };


  this.initialiselisteners () ;
  this.onEntryWork() ;




  changellyCalls.getDashRate().then(data=>{
 this.logger.info("WelcomePage: getDashRate"+ data);

  }, (err) => {
        this.logger.error("WelcomePage: getDashRate "+err);
   });

   this.loaduser() ;

   this.loadaccount() ;


  }

  async loaduser() {
   this.loggedinuser = await this.termsuserservice.getloggedinuser();

  }

  resetdiscount() {
    this.storage.get(environment.storageuniq+'senduserchoice').then(data=>{

      if(data) {
        this.senduserchoice = data;
      if(this.senduserchoice.standardplan == true) {
       this.senduserchoice.discountplan = false;
      this.storage.set(environment.storageuniq+'senduserchoice',this.senduserchoice);
       this.blue011issue.reflectsenduserchoice();
       }
          }
    });

  }

  discountuserchoicechange(e : any) {


    this.storage.set(environment.storageuniq+'senduserchoice',this.senduserchoice);
       this.blue011issue.reflectsenduserchoice();

     if(this.senduserchoice.standardplan == true) {
          setTimeout( ()=>{
             this.resetdiscount() ;
            }, 2000);

     }

  };

   standarduserchoicechange(e : any) {
    if(this.senduserchoice.standardplan == true)
    {
      this.senduserchoice.galaxyplan = false
      this.senduserchoice.starplan = false
      this.senduserchoice.discountplan = false
    }

    this.storage.set(environment.storageuniq+'senduserchoice',this.senduserchoice);
       this.blue011issue.reflectsenduserchoice();

  };

  galaxyuserchoicechange(e : any) {
    if(this.senduserchoice.galaxyplan == true)
    {
      this.senduserchoice.standardplan = false
      this.senduserchoice.starplan = false
    }

    this.storage.set(environment.storageuniq+'senduserchoice',this.senduserchoice);
       this.blue011issue.reflectsenduserchoice();
  };

   staruserchoicechange(e : any) {
    if(this.senduserchoice.starplan == true)
    {
      this.senduserchoice.standardplan = false
      this.senduserchoice.galaxyplan = false
    }

    this.storage.set(environment.storageuniq+'senduserchoice',this.senduserchoice);
       this.blue011issue.reflectsenduserchoice();

  };


  incchangesendfees(e : any) {
    if(this.sendnetworkfeeschange.increase == true)
    {
      this.sendnetworkfeeschange.decrease = false
    }

    this.storage.set(environment.storageuniq+'sendnetworkfeeschange',this.sendnetworkfeeschange);
    
  };

  decchangesendfees(e : any) {
    if(this.sendnetworkfeeschange.decrease == true)
    {
       this.sendnetworkfeeschange.increase = false
    }
    this.storage.set(environment.storageuniq+'sendnetworkfeeschange',this.sendnetworkfeeschange);
  };
  
  async loadaccount() {
     this.useraccount = await this.termsuserservice.getuseraccount();
     if(this.useraccount.termsagreed == 'yes') {
//       this.feesdisplay =   //this.blue011issue.getdisplayfees(this.useraccount);
     }

  }


  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      //alert('Barcode data ' + JSON.stringify(barcodeData));
      this.scannedData = barcodeData;
    }).catch(err => {
      this.logger.info('Error', err);
    });
  }

  displaydash() {
  }

  copywalletaddress () {
  this.clipboard.copy(this.walletaddress);
         this.presentAlert('', '', 'Wallet address copied' );
  }


 loadwalletwif() {
     this.storage.get(environment.storageuniq+'walletwif').then(data=> {
        if(data) {
      this.walletwif = data;
      this.wiftoaddress() ;
      this.loadwalletbalance() ;
        } else {
         this.presentAlert('Wallet not found', 'Go to the wallet tab', 'Create wallet if not created ' );
//      this.router.navigateByUrl('/login');
        }
     });

}

wiftoaddress() {

 if(this.network == 'testnet') {
  this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif ).toAddress(dashcore.Networks.testnet).toString();
  }else if(this.network == 'livenet') {
  this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif ).toAddress(dashcore.Networks.livenet).toString();
  }else {
       this.presentAlert('', '', 'Invalid network' );
  }



}


getwalletbalance() {


 if(!this.walletaddress) {
       this.presentAlert('', '', 'Address field empty ' );
 return;
}

 this.blue011consume.getBalance(this.walletaddress, this.network).then((data: any) => {
      if(data != null)
      {
        this.walletbalance = data;
        this.savewalletbalance(this.walletbalance) ;
      }
      else {
       this.presentAlert('', '', 'Balance check failed ' );
      }
   }, (err)=> {
       this.presentAlert('', '', err );
   });
}

ngOnInit() {

this.loaduser() ;
 this.loadwalletwif() ;
}

 ionViewDidLoad() {
   this.loaduser() ;
 }
  
 ionViewWillUnload() {

 }

 onEntryWork () {
 }

 ionViewDidEnter() {
this.loaduser() ;
    
  }

  initialiselisteners () {
  
  }


  loadwallets() {

  }
/*
  copybitcoinaddress () {
  this.clipboard.copy(this.bitcoinwalletbalance.address);
  }

  copydashcoinaddress () {
  this.clipboard.copy(this.dashcoinwalletbalance.address);
  }
*/

  showbitcoinqr() {
 /*   var qrInfo = {
		name: 'Bitcoin',
		address: this.bitcoinwalletbalance.address
	};
    this.modal = await this.modalCtrl.create(QrPage, {qrInfo: qrInfo});

    await this.modal.present();
*/
  }


  async showdashcoinqr() {
/*
    if(this.serverlessWallet == null || this.serverlessWallet.walletunlocked == false) {
       this.popservice.presentAlert("Unlock wallet before using") ;
        return;
    } else {
      // do nothing
    } 
*/
  }



    private getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : 0;
  }

  whatsappShareAddress(){
  
  var myurl = this.qrcodechild.el.nativeElement.innerHTML;
//alert(myurl);
let html : string   = this.qrcodechild.el.nativeElement.innerHTML;
let img64: string  = html.substr(0, html.length - 2).split('base64,')[1];
let ximg64 = "data:image/png;base64," + img64;


   this.socialSharing.shareViaWhatsApp("test" , ximg64, null).then(()=> {

   }).catch(err=>{
   //alert(err);
    });
  }

 async resolveLocalFile() {
    return this.file.copyFile(`${this.file.applicationDirectory}www/assets/imgs`, '91springlogo.png', this.file.cacheDirectory, `${new Date().getTime()}.png`);
 }

 
 async resolveCreatedFile(image: any) {

   return this.file.writeFile(this.file.cacheDirectory, "test.png", image,  {replace:true});
 }

 async sharewhatsapp() {

  try {
  let xx = await this.socialSharing.canShareVia('whatsapp');
  // Sharing via email is possible
   //alert("whatsapp has permission");
  } catch {

   //alert("whatsapp has no permission");
  }

  let data = await this.resolveLocalFile();
   //alert(data.nativeURL);

//     this.socialSharing.shareViaWhatsApp("test" , data.nativeURL, "http://test.com").then(()=> 
   var newlink = this.webview.convertFileSrc(data.toURL());
   //alert(newlink);

     this.socialSharing.shareVia("whatsapp", "test" ,"subject",  'https://www.dropbox.com/s/9mr8dobn37do88v/endgame.jpeg?raw=1' , "http://test.com").then(()=> {

   //alert("shared");
}).catch(err => {
  // Sharing via email is not possible
   //alert("whatsapp no permission"+ err);
});


 }

 async sharewhatsapp2() {

  try {
  let xx = await this.socialSharing.canShareVia('whatsapp');
  // Sharing via email is possible
   //alert("whatsapp has permission");
  } catch {

   //alert("whatsapp has no permission");
  }

  let data = await this.resolveLocalFile();
   //alert(data.nativeURL);

//     this.socialSharing.shareViaWhatsApp("test" , data.nativeURL, "http://test.com").then(()=> 
     this.socialSharing.shareVia("whatsapp", "test" ,"subject",  "https://belavaditech.com/assets/img/logo/logo-belavadi.jpg" , "http://test.com").then(()=> {

   //alert("shared");
}).catch(() => {
  // Sharing via email is not possible
   //alert("whatsapp no permission");
});


 }

 mywritefile(image: any) {
 //await this.plt.ready();
     //alert("inside wriite" + image);
   this.file.writeFile(this.file.dataDirectory, "test.png", image,  {replace:true}).then(data=> {

     //alert("writing success" + data.nativeURL);
     var testpath = this.file.dataDirectory+ "test.png";
//     this.filePath.resolveNativePath(testpath).then(filePath => {



     this.socialSharing.shareViaWhatsApp("test" , data.nativeURL, "http://test.com").then(()=> {

   //alert("shared");
     }).catch(err1=>{
     //alert(err1);
      });

 /*    }).catch(err => {
        //alert(err);
	this.logger.info(err)

     }); */

      }).catch(err=> {

     //alert("error writing" + err);
     });
   

 }

 async imageextract() {
  var data = await this.myqr.toDataURL();

  let img64: string  = data.substr(0, data.length - 2).split('base64,')[1];
   //alert(img64);
  var image = this.b64toBlob(img64, 'image/png');
  return this.resolveCreatedFile(image) ;

 }

  whatsappShareAddress2(){

  var myurl = this.myqr.toDataURL();
/*
   var image = this.myqr.toCanvas().then(data=>{

     });

getElementById("canvas").toDataURL("image/png")
                    .replace("image/png", "image/octet-stream");
*/

   myurl.then((data)=> {
   //alert(data);
   //  var image = data.replace("image/png", "image/octet-stream");
let img64: string  = data.substr(0, data.length - 2).split('base64,')[1];
   //alert(img64);
   var image = this.b64toBlob(img64, 'image/png');
     this.mywritefile(image);

   }).catch(err=>  {

  
   });

/*
  var myurl = this.myqr.qrcElement.nativeElement.innerHTML;
//alert(myurl);
let html : string   = this.myqr.qrcElement.nativeElement.innerHTML;
let img64: string  = html.substr(0, html.length - 2).split('base64,')[1];
let ximg64 = "data:image/png;base64," + img64;

//alert(ximg64);
   this.socialSharing.shareViaWhatsApp("test" , null, myurl).then(()=> {

   }).catch(err=>{
   //alert(err);
    });
*/
  }




/*
  regularShareAddress(){
  this.socialSharing.share(this.receiveqrcode , null, null, null);
  }


  
*/
  getBitcoinWalletBalance(){
  }


  getDashcoinWalletBalance(){
  }

  clearbitcoin () {

  }

  cleardashcoin () {
  }
  gototerms() {
//        this.menu.close();
//    this.navCtrl.navigateForward(TermsPage, {animate: true});
  }

  gotohelp() {
//    this.navCtrl.navigateForward(HelpPage);

  }

  gotologin() {
//        this.menu.close();
//    this.navCtrl.navigateForward(LoginPage);
    this.router.navigateByUrl('/login');

  }

/*
  pastestring ()
  {
   if (this.plt.is('cordova')) {

     this.clipboard.paste().then(
   (resolve: string) => {
      this.sendaddress = resolve;
      //alert(resolve);
    },
    (reject: string) => {
      //alert('Error: ' + reject);
    }
  );
   }
   else {
	//alert("Feature not supported");
   }

  }
*/ 
  fromSatoshi(x) {
  return this.changellyCalls.fromSatoshi(x);
  }
  toFiatBtc(x) {
  return this.changellyCalls.toFiatBtc(x);
  }

 
  b64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }  

  async logout() {
   await this.logoutuser() ;

   this.loggedinuser = await this.termsuserservice.getloggedinuser();

    this.fireauth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    })
  }

   socialSharingfun() {
    // Check if sharing via email is supported
    this.socialSharing.share('Watch this amazing movie with me at Cineplex this sunday', null, 'https://www.dropbox.com/s/9mr8dobn37do88v/endgame.jpeg?raw=1', 'https://goo.gl/saFds8').then(() => {
      this.logger.info('share success');
      // Sharing via email is possible
    }).catch(() => {
      this.logger.info('share failed');

      // Sharing via email is not possible
    });
  }

 displaydashaddress() {
   this.displayq = 'dash';
 }


  EthtoDashcoinMIn() {

   var fromcoin = "ETH";
   var to = "DASH";
   var amount;


   this.displayq = 'eth';

    this.changellyCalls.getMinAmount(fromcoin, to ).then((data: any)=> {
//     this.logger.log("selectCoin ="+ JSON.stringify(data));
     this.minimumdeposit = data.result;
     //alert(this.minimumdeposit);


    }, (err) => {

    });

 }


 checketh() {

   var from;
   var to = "DASH";
   var amount;
   this.displayq = 'eth';
   
    if( !this.fromethamount || this.fromethamount <= 0) {
      alert("Mention ETH amount to convert");
      return;
    }


    this.changellyCalls.getExchangeAmount('ETH', to , this.fromethamount).then((datareceived: any)=> {
     var data = JSON.parse(datareceived);
     if(data.result) {
     this.ethexchangeamount = data.result;
       }else if(data.error) {
          //alert(data.error.message);
       }

    }, (err) => {
//          alert('Errordata');

    });

 }


 checkbch() {

   var from;
   var to = "DASH";
   var amount;
   this.displayq = 'bch';
    if( !this.frombchamount || this.frombchamount <= 0) {
      alert("Mention BCH`amount to convert");
      return;
    }


    this.changellyCalls.getExchangeAmount('BCH', to , this.frombchamount).then((datareceived: any)=> {
     var data = JSON.parse(datareceived);
     if(data.result) {
     this.bchexchangeamount = data.result;
       }else if(data.error) {
          //alert(data.error.message);
       }

    }, (err) => {

    });

 }


 checkbtc() {

   var from;
   var to = "DASH";
   var amount;
   this.displayq = 'btc';

    if( !this.frombtcamount || this.frombtcamount <= 0) {
      alert("Mention BTC amount to convert");
      return;
    }


    this.changellyCalls.getExchangeAmount('BTC', to , this.frombtcamount).then((datareceived: any)=> {
     var data = JSON.parse(datareceived);
     if(data.result) {
     this.btcexchangeamount = data.result;
       }else if(data.error) {
          //alert(data.error.message);
       }

    }, (err) => {

    });

 }


 displayethaddress() {
   this.displayq = 'eth';

 }
 displaybtcaddress() {
   this.displayq = 'btc';

 }

 displaybchaddress() {
   this.displayq = 'bch';

 }

 shareDashToDeposit() {
   var message = 'Deposit DASH to address ' + this.walletaddress;
   var link = null;
   this.neoShare(message, link) ;

 }

 shareEthToDeposit() {
   var message = 'Deposit ETH to address ' + this.walletaddress;
   var link = null;
   this.neoShare(message, link) ;

 }

 neoShare(message, link) {
/*
  var myurl = this.myqr.qrcElement.nativeElement.innerHTML;
//alert(myurl);
let html : string   = this.myqr.qrcElement.nativeElement.innerHTML;
let img64: string  = html.substr(0, html.length - 2).split('base64,')[1];
let ximg64 = "data:image/png;base64," + img64;

//alert(ximg64);
*/
  var myurl = this.myqr.toDataURL();
   myurl.then((data)=> {
    
   //alert("data="+data);
   let img64: string  = data.substr(0, data.length - 2).split('base64,')[1];
   var image = this.b64toBlob(img64, 'image/png');
   //alert("image="+image);
   this.neoWriteShare(image);

  
  });



 }


 neoWriteShare(image: any) {

   this.file.writeFile(this.file.dataDirectory, "test.png", image,  {replace:true}).then(data=> {
 // not working
 //  this.file.resolveLocalFilesystemUrl(data.toURL()).then(newlink=> {
 //     alert("writing success" + newlink);
// did not work var xx = 'http://localhost:8080/www/assets/imgs/91springlogo.png';
var xx = 'https://www.dropbox.com/s/9mr8dobn37do88v/endgame.jpeg?raw=1';

     this.socialSharing.share('message' , null, xx, 'https://goo.gl/saFds8').then((xx) => {
      //alert('share success'+ xx);
    }).catch((err) => {
      alert('share failed'+err);

    });


//   });

 // this.webview.convertFileSrc(data.toURL());
     //var testpath = this.file.cacheDirectory+ "test.png";
     //alert(testpath);




      }).catch(err=> {

     //alert("error writing " + err);
     });


 }




 doBchDashConversion() {
   
   this.fromcoin = 'BCH';
   this.fromamount = this.frombchamount;
   this.fromToDashcoinTransaction();
 }

 doBtcDashConversion() {
   
   this.fromcoin = 'BTC';
   this.fromamount = this.frombtcamount;
   this.fromToDashcoinTransaction();

 }

 
 doEthDashConversion() {
   
   this.fromcoin = 'ETH';
   this.fromamount = this.fromethamount;
   this.fromToDashcoinTransaction();

 }

 getRefundAddress(base) {
   if(base == "ETH") {
	return environment.fallbackaddress.ethereumaddress;
   }else if(base == "BTC") {
	return environment.fallbackaddress.bitcoinaddress;

   }else if(base == "BCH") {
	return environment.fallbackaddress.bitcoincashaddress;

   } else if(base == "LTC") {
	return environment.fallbackaddress.litecoinaddress;

   }
 }

  fromToDashcoinTransaction() {

   var data = {
  "jsonrpc": "2.0",
  "id": "test",
  "method": "createTransaction",
  "params": {
    "from": this.fromcoin,
    "to": "DASH",
    "address": this.walletaddress,
    "extraId": null,
    "refundAddress": this.getRefundAddress(this.fromcoin),
    "amount": this.fromamount,
    "refundExtraId": null
  },
};

    this.changellyCalls.sendTransaction(data).then((datareceived: any)=> {
  //     alert (datareceived);
       if(this.loggedinuser.uid == '') {
         this.presentAlert('', '', 'Login to use' );
         return;
       }

       var data = JSON.parse(datareceived);
       if(data.result ) {
       this.depositcoin = data.result.currencyFrom;
       this.depositaddress = data.result.payinAddress;
        
       if(this.fromcoin == 'ETH') {
          this.ethaddress = this.depositaddress ;
          this.presentModalEthtoDash();
       }else if(this.fromcoin == 'BTC') {
          this.btcaddress = this.depositaddress ;
          this.presentModalBtctoDash();
       }else if(this.fromcoin == 'BCH') {
          this.bchaddress = this.depositaddress ;
          this.presentModalBchtoDash();
       }


       this.depositid = data.result.id;
       var depositrec = {
            id: '',
            changellyid: data.result.id,
            uid: this.loggedinuser.uid ,
            network: network,
            depositid: this.depositid,
            payoutAddress: data.result.payoutAddress,
            payinAddress: data.result.payinAddress,
            refundAddress: data.result.refundAddress,
            currencyFrom: data.result.currencyFrom,
            currencyTo: data.result.currencyTo,
            amountExpectedFrom: data.result.amountExpectedFrom,
            createdAt: data.result.createdAt,
            transactiondate: Date.now().toString()
      };


       this.changellyTranService.createTransactionEntry(depositrec);
//       this.listenToDismiss(this.depositid) ;
//       this.showothertodashcoinqr();

       }else if(data.error) {
          //alert(data.error.message ) ;
       }
 
    }) ;

  }

  imagesharetest() {

  var myurl = this.myqr.toDataURL();
   myurl.then((data)=> {
    this.socialSharing.share(null, 'Android filename', data , null).then(()=> {
      //alert('share sucecss');

    }).catch((err) => {
      //alert('share failed'+err);

    });
   
    });



  }

   socialSharingfun1() {
    // Check if sharing via email is supported
var xx = 'http://localhost:8080/www/assets/imgs/91springlogo.png';

    this.socialSharing.share('Watch this amazing movie with me at Cineplex this sunday', null, xx , 'https://goo.gl/saFds8').then(() => {
      this.logger.info('share success');
      // Sharing via email is possible
    }).catch(() => {
      this.logger.info('share failed');

      // Sharing via email is not possible
    });
  }


   socialSharingfun2() {
    // Check if sharing via email is supported
var xx = 'https://www.dropbox.com/s/9mr8dobn37do88v/endgame.jpeg?raw=1';
    this.socialSharing.share('Watch this amazing movie with me at Cineplex this sunday', null, xx , 'https://goo.gl/saFds8').then(() => {
      this.logger.info('share success');
      // Sharing via email is possible
    }).catch(() => {
      this.logger.info('share failed');

      // Sharing via email is not possible
    });
  }

   async socialSharingfun3() {
    // Check if sharing via email is supported

let data = await this.resolveLocalFile();
  //alert(data.nativeURL);
    this.socialSharing.share('Watch this amazing movie with me at Cineplex this sunday', null, data.nativeURL , 'https://goo.gl/saFds8').then(() => {
      this.logger.info('share success');
      // Sharing via email is possible
    }).catch(() => {
      this.logger.info('share failed');

      // Sharing via email is not possible
    });
  }



   async socialSharingfun4() {
    // Check if sharing via email is supported
 let data = await this.imageextract() ;
  //alert(data.nativeURL);
//   var xx = this.webview.convertFileSrc(data.toURL());
    this.socialSharing.share('Watch this amazing movie with me at Cineplex this sunday', null, data.nativeURL , 'https://goo.gl/saFds8').then(() => {
      this.logger.info('share success');
      // Sharing via email is possible
    }).catch(() => {
      this.logger.info('share failed');

      // Sharing via email is not possible
    });
  }


  async shareEmail() {
    let file = await this.resolveLocalFile();
    
    //alert('File: '+ file); 

    this.socialSharing.shareViaEmail('testing', 'subject', ['raga2560@gmail.com'], null, null, file.nativeURL  ).then(()=> {

    //alert('Share success');
    }).catch(e=> {
    //alert('Share fail'+ e);
    
    })

  }

  dismiss() {
    this.router.navigateByUrl('/tabs/tab1');

  }

  async presentModalDash() {
    if(!this.walletaddress) {
      //alert("Wallet address is empty");
      return;
    }
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

 async presentModalEthtoDash() {
    var item = {
        displayq: 'eth',
        addresstodeposit: this.ethaddress,
        title: 'Address to deposit',
        topmessage: 'Deposit ' + this.fromamount + ' ETH',
        bottommessage: ''
    };

    const modal = await this.modalController.create({
      component: QrdisplaymodalPage,
      componentProps: { obj: item }
    });
    return await modal.present();
  }


 async presentModalBtctoDash() {
    var item = {
        displayq: 'btc',
        addresstodeposit: this.btcaddress,
        title: 'Address to deposit',
        topmessage: 'Deposit ' + this.fromamount + ' BTC',
        bottommessage: ''
    };

    const modal = await this.modalController.create({
      component: QrdisplaymodalPage,
      componentProps: { obj: item }
    });
    return await modal.present();
  }

 async presentModalBchtoDash() {
    var item = {
        displayq: 'bch',
        addresstodeposit: this.bchaddress,
        title: 'Address to deposit',
        topmessage: 'Deposit ' + this.fromamount + ' BCH',
        bottommessage: ''
    };

    const modal = await this.modalController.create({
      component: QrdisplaymodalPage,
      componentProps: { obj: item }
    });
    return await modal.present();
  }

  reversingdash() {
    this.presentAlert("Reversing DASH", "After sending through escrow", "Click the button to reverse and accept funds, in reversible send screen");
  }

  sendreversibledash() {
    this.presentAlert("Sending Reversible DASH", "Sending through escrow", "Click the button reversible send in sending DASH screen ");

  }

  senddashdirect() {
    this.presentAlert("Sending DASH directly", "Sending directly", "Click the button direct send in sending DASH screen. This is not reversible ");
  }


  receivedashdirect() {
    this.presentAlert("Receive DASH ", "Receive DASH directly ", "Provide your wallet address to sender. Ask him to send funds to it. ");
  }

 receivefromescrow() {
    this.presentAlert("Receive DASH from esrcow", "DASH sent through escrow ", "Copy the Contract/PIN provided by sendr on receive screen. Then accept fund. ");

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

  if(this.walletbalance.address == '') {
          this.getwalletbalance() ;
  }
}

savewalletbalance(walletbalance) {
  
   this.storage.set(environment.storageuniq+'walletbalance', walletbalance ).then(x=>{
         this.termsuserservice.reflectwalletbalance();

     });

}

async  getaccount() {

   this.loggedinuser = await this.termsuserservice.getloggedinuser();
   console.log("sgsg = " + JSON.stringify(this.loggedinuser));

   if(this.loggedinuser.uid == '') {
    this.presentAlert("", "", "User not loggedin " +environment.err.W1233.code);
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
    this.presentAlert("", "", "Agree terms of usage. ");
    } else {
    this.presentAlert("", "", "Error reading account. " +environment.err.W1233.code);
    }

   });



  }

 async logoutuser() {

    await  this.storage.set(environment.storageuniq+'loggedinuser',null);
    this.termsuserservice.reflectloginuser();

  }


}
