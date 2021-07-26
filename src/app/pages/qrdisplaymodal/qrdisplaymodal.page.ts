import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import {NgxQRCodeComponent} from 'ngx-qrcode2';
import { SocialShareService } from '../../providers/socialshare';



@Component({
  selector: 'app-qrdisplaymodal',
  templateUrl: './qrdisplaymodal.page.html',
  styleUrls: ['./qrdisplaymodal.page.scss'],
})
export class QrdisplaymodalPage implements OnInit {
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
   var message = "DASH address to deposit is " + this.item.addresstodeposit;
   return this.socialshareservice.socialSharingAnything(message , null, null);
  }

 dashaddresswithqrsocialshare() {

   var imageqr = this.myqr;
   var message = "DASH address to deposit is " + this.item.addresstodeposit;
   return this.socialshareservice.socialSharingQrImage(message, imageqr , null);
 }


 ethaddresssocialshare() {
   var message = "ETH address to deposit is " + this.item.addresstodeposit;
   return this.socialshareservice.socialSharingAnything(message , null, null);
  }

 ethaddresswithqrsocialshare() {

   var imageqr = this.myqr;
   var message = "ETH address to deposit is " + this.item.addresstodeposit;
   return this.socialshareservice.socialSharingQrImage(message, imageqr, null);
 }


bchaddresssocialshare() {
   var message = "BCH address to deposit is " + this.item.addresstodeposit;
   return this.socialshareservice.socialSharingAnything(message , null, null);
  }

 btcaddresssocialshare() {
   var message = "BTC address to deposit is " + this.item.addresstodeposit;
   return this.socialshareservice.socialSharingAnything(message , null, null);
  }

 bchaddresswithqrsocialshare() {

   var imageqr = this.myqr;
   var message = "BCH address to deposit is " + this.item.addresstodeposit;
   return this.socialshareservice.socialSharingQrImage(message, imageqr, null);
 }


btchaddresssocialshare() {
   var message = "BTC address to deposit is " + this.item.addresstodeposit;
   return this.socialshareservice.socialSharingAnything(message , null, null);
  }

 btchaddresswithqrsocialshare() {

   var imageqr = this.myqr;
   var message = "BTC address to deposit is " + this.item.addresstodeposit;
   return this.socialshareservice.socialSharingQrImage(message, imageqr, null);
 }


  ngOnInit() {
  }

  dismiss() {
    this.modalctrl.dismiss();
  }

}
