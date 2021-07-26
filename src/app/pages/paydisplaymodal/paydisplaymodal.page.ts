import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import {NgxQRCodeComponent} from 'ngx-qrcode2';
import { SocialShareService } from '../../providers/socialshare';



@Component({
  selector: 'app-paydisplaymodal',
  templateUrl: './paydisplaymodal.page.html',
  styleUrls: ['./paydisplaymodal.page.scss'],
})
export class PaydisplaymodalPage implements OnInit {
  @ViewChild (NgxQRCodeComponent, {static: false}) myqr: any;

  elementType = "dummy";
  item;

  constructor(private params: NavParams, 
    public socialshareservice: SocialShareService,
    private modalctrl: ModalController) {
    this.item = params.get('obj');
  }

  socialshare() {
   var imageqr = this.myqr;
   var linkqr = 'http://test.com';
   return this.socialshareservice.socialSharingQrImage("Testing", imageqr, linkqr);
  }

  dashaddresssocialshare() {
   var message = "Payment DASH address to verify is " + this.item.addresstoverify;
   return this.socialshareservice.socialSharingAnything(message , null, null);
  }

 dashaddresswithqrsocialshare() {

   var imageqr = this.myqr;
   var message = "DASH address to verify payment is " + this.item.addresstoverify;
   return this.socialshareservice.socialSharingQrImage(message, imageqr , null);
 }

messagepinqrsocialshare() {
   var imageqr = this.myqr;
   var message = "Payment QRcode "+ this.item.topmessage  ;
   return this.socialshareservice.socialSharingQrImage(message, imageqr , null);
 }

 ethaddresssocialshare() {
   var message = "ETH address to deposit is " + this.item.addresstodeposit;
   return this.socialshareservice.socialSharingAnything(message , null, null);
  }



  ngOnInit() {
  }

  dismiss() {
    this.modalctrl.dismiss();
  }

}
