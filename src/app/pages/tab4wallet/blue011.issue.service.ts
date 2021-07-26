import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import {of as observableOf} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {environment} from '../config/environment';
import {Incomeshare} from '../models/incomeshare.model';
import {webtestnetissueconfig, weblivenetissueconfig} from '../config/webissueconfig';
import { Networkfees } from '../models/networkfees.model';
import { Sendusechoice } from '../models/senduserchoice.model';
import { ChangellyCalls } from '../../providers/changelly';




declare var dashcore;

@Injectable({
  providedIn: 'root'
})

export class Blue011IssueService {
  public token: any;
  url: string ;
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

  Transaction = dashcore.Transaction;

  senduserchoice : Sendusechoice = {
     starplan: false,
     galaxyplan: false,
     standardplan: true, 
     discountplan: false 

  }


  sendingmessages= [];
  sendtransactions= [];

  constructor(public http: Http, 
                 public changellyCalls: ChangellyCalls, // , .toSatoshi(this.policydata[i].amount))
		public storage: Storage) {
      this.url = environment.hosteddomain ;

     this.loadsendingmessages() ;
     this.loadsendtransactions() ;

  }

  getdisplayfees(useraccount) {
/*
    this.feesdisplay.stdgalaxyfeesdisp =  "DASH " + this.changellyCalls.fromSatoshi(Number(useraccount.galaxyfees.stdfixed)) + Number(useraccount.galaxyfees.stdpercentage) + "%"; 
    this.feesdisplay.stdstarfeesdisp =  "DASH " + this.changellyCalls.fromSatoshi(Number(useraccount.starfees.stdfixed)) + Number(useraccount.starfees.stdpercentage) + "%"; 
    this.feesdisplay.stdfeesdisp =  "DASH " + this.changellyCalls.fromSatoshi(Number(useraccount.fees.stdfixed)) + Number(useraccount.fees.stdpercentage) + "%"; 
    this.feesdisplay.stddiscountdisp =  "DASH " + this.changellyCalls.fromSatoshi(Number(useraccount.discount.stdfixed)) + Number(useraccount.discount.stdpercentage) + "%"; 
    this.feesdisplay.rvtgalaxyfeesdisp =  "DASH " + this.changellyCalls.fromSatoshi(Number(useraccount.galaxyfees.rvtfixed)) + Number(useraccount.galaxyfees.rvtpercentage) + "%"; 
    this.feesdisplay.rvtstarfeesdisp =  "DASH " + this.changellyCalls.fromSatoshi(Number(useraccount.starfees.rvtfixed)) + Number(useraccount.starfees.rvtpercentage) + "%"; 
    this.feesdisplay.rvtfeesdisp =  "DASH " + this.changellyCalls.fromSatoshi(Number(useraccount.fees.rvtfixed)) + Number(useraccount.fees.rvtpercentage) + "%"; 
    this.feesdisplay.rvtdiscountdisp =  "DASH " + this.changellyCalls.fromSatoshi(Number(useraccount.discount.rvtfixed)) + Number(useraccount.discount.rvtpercentage) + "%"; 
*/
    return this.feesdisplay;
  }

  savesendingmessage (details: any) {
    if(details != null) {
      this.sendingmessages.push(details);
      this.storage.set(environment.storageuniq+'issuesendingmessages',this.sendingmessages);
    }
  }

  updatesendingmessage(details: any) {

      for(var i=0; i< this.sendingmessages.length; i++) {
        if(this.sendingmessages[i].address == details.toaddress) {
           this.sendingmessages[i].status = 'funded';
           this.sendingmessages[i].balance = details.amount ;
        }
      }
      this.storage.set(environment.storageuniq+'issuesendingmessages',this.sendingmessages);
  }

  balanceupdatesendingmessage(msg) {
    console.log(msg);
      for(var i=0; i< this.sendingmessages.length; i++) {
        if(this.sendingmessages[i].address == msg.address) {
           if(msg.balance == 0) {
              if(this.sendingmessages[i].status == 'funded') {
                this.sendingmessages[i].status = 'spent';
               }
               else {
                this.sendingmessages[i].status = 'empty';
               }
           }
           else {
                this.sendingmessages[i].status = 'funded';
           }
          this.sendingmessages[i].balance = msg.balance ;
        }
     }

     this.storage.set(environment.storageuniq+'issuesendingmessages',this.sendingmessages);
  } 

  deletemessage (index) {
      this.sendingmessages.splice(index, 1);
      return this.storage.set(environment.storageuniq+'issuesendingmessages',this.sendingmessages);
      //return this.loadsendingmessages() ;
  }

  loadsendingmessages() {
        return new Promise((resolve, reject) => {
      this.storage.get(environment.storageuniq+'issuesendingmessages').then((data)=> {
	if(data) {
        this.sendingmessages = data;
        }
        resolve(0);
      });

      })

  }

  
 
   reflectsenduserchoice() {
        return new Promise((resolve, reject) => {
      this.storage.get(environment.storageuniq+'senduserchoice').then((data)=> {
        if(data) {
        this.senduserchoice = data;
        }
        resolve(0);
      });

      })

  }

  
  getsendingmessages() {
    return this.storage.get(environment.storageuniq+'issuesendingmessages');
  }

  savesendtransaction (details: any) {
    if(details != null) {
      this.sendtransactions.push(details);
      this.storage.set(environment.storageuniq+'sendtransactions',this.sendtransactions);
    }
  }

  clearsentall() {
      this.sendtransactions.length = 0;
      return this.storage.set(environment.storageuniq+'sendtransactions',this.sendtransactions);
  }


  loadsendtransactions() {
        return new Promise((resolve, reject) => {
      this.storage.get(environment.storageuniq+'sendtransactions').then((data)=> {
        if(data) {
        this.sendtransactions = data;
        }
       resolve(0);
      });

     });
  }

  getsenttransactions() {
    return this.storage.get(environment.storageuniq+'sendtransactions');
  }


 deleteallmessage() {
      this.sendingmessages.length = 0;
      return this.storage.set(environment.storageuniq+'issuesendingmessages',this.sendingmessages);

 }


  issuesendingmessage (details: any) {



        return new Promise((resolve, reject) => {


             let headers = new Headers();

            if(details.network == 'testnet'){
                headers.append('Authorization', webtestnetissueconfig.apikey);
            }else {
                headers.append('Authorization', weblivenetissueconfig.apikey);

            }
             headers.append('Content-Type', 'application/json');

            this.http.post(this.url + '/blue011/issuemessage', JSON.stringify(details), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }

  getissuedaddresses () {


        return new Promise((resolve, reject) => {


             let headers = new Headers();
             headers.append('Authorization', webtestnetissueconfig.apikey);
             headers.append('Content-Type', 'application/json');


            this.http.post(this.url + '/getissuedaddresses', null, {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }


   getBalance(address: string, network: string): any {

     var url ;

     if(network == 'testnet') {
        url = 'https://testnet-insight.dashevo.org/insight-api/addr/';
     }
     else {
        url = 'https://insight.dashevo.org/insight-api/addr/';
     }

     return new Promise((resolve, reject) => {


     this.http.get(url+address).subscribe(res => {
                let data = res.json();
                resolve(data);
        }, (err) => {
          reject(err);
        });
    });


  }

   getUtxo(address: string, network: string): any {

     var url ;

     if(network == 'testnet') {
        url = 'https://testnet-insight.dashevo.org/insight-api/addr/';
     }
     else {
        url = 'https://insight.dashevo.org/insight-api/addr/';
     }

     return new Promise((resolve, reject) => {


     this.http.get(url+address+"/utxo").subscribe(res => {
                let data = res.json();
                resolve(data);
        }, (err) => {
          reject(err);
        });
    });


  }

  getnetworkfees(type, toamount, change: Networkfees, useraccount) {
    if(change.increase) {
    return (Number(useraccount.networkfees) + 500);
    }

    if(change.decrease) {
    return (Number(useraccount.networkfees) - 500);
    }

    return Number(useraccount.networkfees);
  }


  getdirectincomeshare(type, toamount, useraccount) {

   var incomeshare: Incomeshare = {
      incomeaddress: '',
      incomeamount: ''
   };
      if( useraccount.network == 'livenet') {
    incomeshare.incomeaddress = useraccount.liveincomeaddress;
  } else {
    incomeshare.incomeaddress = useraccount.testincomeaddress;
  }



  if(this.senduserchoice.galaxyplan) {
  incomeshare.incomeamount = ((Number(useraccount.galaxyfees.stdpercentage) * 0.01 * toamount + Number(useraccount.galaxyfees.stdfixed)).toFixed());
  }else if(this.senduserchoice.starplan) {

  incomeshare.incomeamount = ((Number(useraccount.starfees.stdpercentage) * 0.01 * toamount + Number(useraccount.starfees.stdfixed)).toFixed());
  } else {
  incomeshare.incomeamount = ((Number(useraccount.fees.stdpercentage) * 0.01 * toamount + Number(useraccount.fees.stdfixed)).toFixed());

  }
   return incomeshare;
  }

  getrevertincomeshare(type, toamount, useraccount) {

   var incomeshare: Incomeshare = {
      incomeaddress: '',
      incomeamount: ''
   };
      if( useraccount.network == 'livenet') {
    incomeshare.incomeaddress = useraccount.liveincomeaddress;
  } else {
    incomeshare.incomeaddress = useraccount.testincomeaddress;
  }


  if(this.senduserchoice.galaxyplan) {
  incomeshare.incomeamount = ((Number(useraccount.galaxyfees.rvtpercentage) * 0.01 * toamount + Number(useraccount.galaxyfees.rvtfixed)).toFixed());
  }else if(this.senduserchoice.starplan) {

  incomeshare.incomeamount = ((Number(useraccount.starfees.rvtpercentage) * 0.01 * toamount + Number(useraccount.starfees.rvtfixed)).toFixed());
  } else {
  incomeshare.incomeamount = ((Number(useraccount.fees.rvtpercentage) * 0.01 * toamount + Number(useraccount.fees.rvtfixed)).toFixed());
  }

   return incomeshare;
  }

  createtransaction(utxo, privatekey,changeaddress, toaddress, toamount,fees, incomeshare:Incomeshare, useraccount) {

  if(useraccount == null) 
  {
    alert("Setup not ready");
    return;
  }

  var incomeaddress = incomeshare.incomeaddress;

   if( useraccount.network == 'livenet') {
    if(!dashcore.Address.isValid(incomeaddress, dashcore.Networks.livenet)) {
      alert("Invalid address internal error");
      return;
    }
    if(!dashcore.Address.isValid(changeaddress, dashcore.Networks.livenet)) {
      alert("Invalid address internal error");
      return;
    }
  } else {
    if(!dashcore.Address.isValid(incomeaddress, dashcore.Networks.testnet)) {
      alert("Invalid address internal error");
      return;
    }
    if(!dashcore.Address.isValid(changeaddress, dashcore.Networks.testnet)) {
      alert("Invalid address internal error");
      return;
    }
  }


  var income = Number(Number(incomeshare.incomeamount).toFixed(0));
  var networkfees = Number(fees);

  var tx; 
  var txobject; 
  try {
  tx = new this.Transaction()
      .from(utxo)
      .to([{address: incomeaddress, satoshis: income},
        {address: toaddress, satoshis: toamount}])
      .fee(networkfees)
      .change(changeaddress)
      .sign(privatekey);

  txobject = tx.toBuffer();
  } catch (err) {

    alert(err);
  } 

   return txobject;
 }


  broadcast( tx, network: string) {
 
   var pushtx = { 
    rawtx: tx
   };  

   var url;

   if(network == 'testnet') {
        url = 'https://testnet-insight.dashevo.org/insight-api/';
     }
     else {
        url = 'https://insight.dashevo.org/insight-api/';
     }



 
   var lurl =  url + 'tx/send';
// 'https://testnet-insight.dashevo.org/insight-api/tx/send';

   return new Promise((resolve, reject) => {


             let headers = new Headers();

             headers.append('Content-Type', 'application/json');

            this.http.post(lurl, JSON.stringify(pushtx), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }


 
}
