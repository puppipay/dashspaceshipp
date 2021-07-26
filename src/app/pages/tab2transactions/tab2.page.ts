import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { FromSatoshiPipe } from '../pipes/fromsatoshi';

import { Blue011ConsumeService } from '../tab4wallet/blue011.consume.service';
import { Blue011IssueService } from '../tab4wallet/blue011.issue.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

public receivedtransactions = [];
public senttransactions = [];
public whichtransaction = "senttransactions";

constructor(
        private blue011consumeservice: Blue011ConsumeService,
         public alertController: AlertController,
        private blue011issueservice: Blue011IssueService

  ) {
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


ngOnInit() {

this.getreceivetransactions();
this.getsenttransactions();

}

refreshsent() {
  this.getsenttransactions() ;
   this.presentAlert("", "", "Refreshed");
}

refreshreceived() {
  this.getsenttransactions() ;
  this.getreceivetransactions() ;
   this.presentAlert("", "", "Refreshed");
}

getreceivetransactions() {

   this.blue011consumeservice.getreceivetransactions().then((data: any) => {
      if(data != null)
      {
        this.receivedtransactions = data;
      }
      else {
        // alert("No receive transactions ");
    }
    });

}
 

getsenttransactions() {

   this.blue011issueservice.getsenttransactions().then((data: any) => {
      if(data != null)
      {
        this.senttransactions = data;
        //alert(JSON.stringify(this.senttransactions));
      }
      else {
        //alert("No sent transactions ");
    }
    });

}

clearreceivedall() {
   this.blue011consumeservice.clearreceiveall();
   this.presentAlert("", "", "Cleared");
}

clearsentall() {
   this.blue011issueservice.clearsentall();
   this.presentAlert("", "", "Cleared");
}
}
