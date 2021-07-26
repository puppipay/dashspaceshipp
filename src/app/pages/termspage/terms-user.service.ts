import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
//import 'rxjs/add/operator/map';
import {of as observableOf} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {environment} from '../config/environment';
//import {webtestnetconsumeconfig, weblivenetconsumeconfig} from '../config/webconsumeconfig';

import { loggedinUser } from '../models/loggedinuser.model' ;
import { walletBalance } from '../models/walletbalance.model' ;




@Injectable({
  providedIn: 'root'
})
export class TermsuserService {
  public token: any;
  url: string ;
  apiKey = '813705e2f4cafa9acd1b2a0c29855';
  apiSecret = 'xx';
  localname = "productcreate";
  myproduct: any;
  loggedinuser: loggedinUser = {
        uid: '',
        displayName: '',
        photoURL : '',
        phoneNumber: '',
        email: '',
        emailVerified: false
      };

  walletbalance : walletBalance = {
   address: '',
            balance: 0,
            balanceSat: 0,
            unconfirmedBalance:0,
            unconfirmedBalanceSat:0
  };

  defaultloggedinuser: loggedinUser = {
        uid: '',
        displayName: '', 
        photoURL : '',
        phoneNumber: '',
        email: '',
        emailVerified: false
      };

 
 useraccount : any = {
     termsagreed: 'no',
     safetyconfirmation: false,
     liveaddress: '',
     testaddress: '',
     activeitems: {
       star: false,
       galaxy: false,
       discount: false,
     }
  } ;

  constructor(public http: Http, public storage: Storage) {
      this.url = environment.hosteddomain ;

  }

  async getloggedinuser() {
    var xx = await this.reflectloginuser() ;

     return this.loggedinuser;

  }

  async getwalletbalance() {
    var xx = await this.reflectwalletbalance() ;

     return this.walletbalance;

  }

  reflectwalletbalance() {
      return new Promise((resolve, reject) => {
      this.storage.get(environment.storageuniq+'walletbalance').then((data)=> {
        if(data) {
        this.walletbalance = data;
        }
        });
      });
  }


  reflectloginuser() {
        return new Promise((resolve, reject) => {
      this.storage.get(environment.storageuniq+'loggedinuser').then((data)=> {
        if(data) {
        console.log("reflectloginuser="+data);
        var user = JSON.parse(data);
         var xx : loggedinUser = {
         uid  : user.uid,
         displayName  : user.displayName,
         photoURL  : user.photoURL,
         phoneNumber  : user.phoneNumber,
         email  : user.email,
         emailVerified  : user.emailVerified,
         };
        this.loggedinuser = xx;

        resolve(this.loggedinuser);
        }else {
        this.loggedinuser = this.defaultloggedinuser;
        resolve(this.defaultloggedinuser); 
        }
      },(err) => {
        this.loggedinuser = this.defaultloggedinuser;
        resolve(this.defaultloggedinuser); 
      });

      })

  }


  async getuseraccount() {
    var xx = await this.reflectuseraccount() ;
    return this.useraccount;
    

  }

  reflectuseraccount() {
        return new Promise((resolve, reject) => {
      this.storage.get(environment.storageuniq+'useraccount').then((data)=> {
        if(data) {
        this.useraccount = JSON.parse(data);
        }
        resolve(0);
      });

      })

  }
 

/*
   agreeterms (details: any) {


        return new Promise((resolve, reject) => {

              let headers = new Headers();

            if(details.network == 'testnet'){
                headers.append('Authorization', webtestnetconsumeconfig.apikey);
            }else {
                headers.append('Authorization', weblivenetconsumeconfig.apikey);

            }
             headers.append('Content-Type', 'application/json');


            this.http.post(this.url + '/mobuser/webtermsagree', JSON.stringify(details), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }

*/
  getaccount (details: any) {


        return new Promise((resolve, reject) => {

            this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');


            this.http.post(this.url + '/mobuser/getaccount', JSON.stringify(details), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });
        });

  }

   createaccount (details: any) {


        return new Promise((resolve, reject) => {

            this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');


            this.http.post(this.url + '/mobuser/createaccount', JSON.stringify(details), {headers: headers})
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
