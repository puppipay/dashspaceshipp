import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

//import 'rxjs/add/operator/toPromise';
import { environment } from '../pages/config/environment';

import { Observable, of, throwError } from 'rxjs';

//import * as merged from 'npmthemergedlib';

//declare var merged;
//let  dashbitcore = merged.dashbitcore;

let network = environment.network;


@Injectable()
export class Dashcoin {

  constructor(public http: Http) {

  }

  getRandomPubkey(){
//    var keyPair = foo.bitcoin.ECPair.makeRandom();
//    return keyPair.getPublicKeyBuffer().toString('hex');
/*
    var privateobject = dashbitcore.privateKey();
    return privateobject.toPublicKey();
*/

  }

  getBalances(addr: any): any {

     var address = '2N43g2SV2PRp3FJUZ92NHDYY36QckV6mSP9'
      if(addr)
      {
             address = addr;
      }
    // If changing to different lookup like blockcypher, following need change

    var url ; // 'https://testnet-insight.dashevo.org/insight-api/addr/';
    if(network == "testnet") {
    url = environment.dashcointestneturl + '/insight-api/addr/';
    } else {
    url = environment.dashcoinliveneturl + '/insight-api/addr/';
    }
     //var url = 'https://api.blockcypher.com/v1/btc/test3/addrs/';
     //this.http.get(url+address+"/full").map(res => res.json())
     return new Promise((resolve, reject) => {


     this.http.get(url+address)  // .map(res => res.json())
        .subscribe((data: any) => {
         var newdata = {
		balance : data.balanceSat,
                unconfirmed_balance: data.unconfirmedBalanceSat,
		address: data.addrStr
          };
        
          resolve(newdata);
        }, (err) => {
          reject(err);
        });
    });


  }



}
