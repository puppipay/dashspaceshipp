import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import {of as observableOf} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {environment} from '../config/environment';
import {webtestnetissueconfig, weblivenetissueconfig} from '../config/webissueconfig';
import { ChangellyCalls } from '../../providers/changelly';

declare var dashcore;

@Injectable({
  providedIn: 'root'
})

export class PolicyService {
  public token: any;
  url: string ;
  policydata : any =  
  [
    {
      type: 'directsend',
      situation: 'nokyc',
      display: 'Limit for sending without kyc is DASH ',
      checking: 'greaterthan',
      amount: 1.2
    }, 
    {
      type: 'directsend',
      situation: 'nokyc',
      display: 'Reached maximum amount allowed without kyc DASH ',
      checking: 'greaterthan',
      amount: 1.0
    }, 
    {
      type: 'directsend',
      situation: 'maximumlimitkyc',
      display: 'Reached maximum amount allowed to send DASH ',
      checking: 'greaterthan',
      amount: 10
    }, 
    {
      type: 'directsend',
      situation: 'kyclimitnokyc',
      display: 'Kyc needed to send DASH ',
      checking: 'greaterthan',
      amount: 1
    }, 
    {
      type: 'directsend',
      situation: 'minimumsend',
      display: 'Minimum to send is DASH ',
      checking: 'lessthan',
      amount: 0.016  
    }, 
    {
      type: 'directsend',
      situation: 'reverseminimumsend',
      display: 'Minimum to send is DASH ',
      checking: 'lessthan',
      amount: 0.06  
    }, 
  




  ] ;


  receivepolicydata : any =  
  [
    {
      type: 'consume',
      situation: 'nokyc',
      display: 'Limit for receiving without kyc is DASH ',
      checking: 'greaterthan',
      amount: 1.2
    }, 
    {
      type: 'consume',
      situation: 'kyclimitnokyc',
      display: 'Kyc needed to receive greater than DASH ',
      checking: 'greaterthan',
      amount: 1.2
    }, 
    {
      type: 'consume',
      situation: 'withkyclimit',
      display: 'Maximum allowed to receive DASH ',
      checking: 'greaterthan',
      amount: 1.0
    }, 
  ];



  

  constructor(public http: Http, public storage: Storage,
              public changellyCalls: ChangellyCalls             

  	) {
     this.url = environment.hosteddomain ;

     this.loadpolicy() ;

  }

  checkreceivepolicy() {
    return this.receivepolicydata; 

  }

  check(item, amount) {
   var policystatus = {
		code : 0,
 	message : ''
         };

     for(var i=0; i< this.policydata.length; i++){
       if(this.policydata[i].situation == item) {
         if(this.policydata[i].checking == 'greaterthan') {
	   if(amount > this.changellyCalls.toSatoshi(this.policydata[i].amount)) {
	   policystatus.code = -1; 
           policystatus.message = this.policydata[i].display + this.policydata[i].amount;
           return policystatus;
           } else {
	   policystatus.code = 0; 
           policystatus.message = '';
           return policystatus;
           }
        } 
         if(this.policydata[i].checking == 'lessthan') {
           if(amount < this.changellyCalls.toSatoshi(this.policydata[i].amount)) {
           policystatus.code = -1;
           policystatus.message = this.policydata[i].display + this.policydata[i].amount;
           return policystatus;
           } else {
           policystatus.code = 0;
           policystatus.message = '';
           return policystatus;
           }
        }



       }
     }
  }


  loadpolicy() {

   return this.storage.get(environment.storageuniq+'policydata').then(data=> {
    return this.policydata;
   });

 }


  getpolicy (details) {

   return new Promise((resolve, reject) => {


           this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');



            this.http.post(this.url + '/mobuser/policy', JSON.stringify(details), {headers: headers})
              .subscribe(res => {
                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });
        });


  }


  confirmsafety (details) {

   return new Promise((resolve, reject) => {


           this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');



            this.http.post(this.url + '/mobuser/mobconfirmsafety', JSON.stringify(details), {headers: headers})
              .subscribe(res => {
                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });
        });


  }



 
}
