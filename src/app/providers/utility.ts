import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';

// import 'rxjs/add/operator/toPromise';
import { Http ,Headers} from '@angular/http';

// import { Observable } from 'rxjs/Observable';

import { environment } from '../pages/config/environment';
import { Logger } from './logger/logger';

//import * as merged from 'npmthemergedlib';

// let firebasewebapikey = environment.production?environment.productionfirebaseconfig.apiKey:environment.sandboxfirebaseconfig.apiKey;
// let shortlink = environment.production?environment.productionshortlink:environment.sandboxshortlink;

let firebasewebapikey = environment.hostingfirebaseconfig.apiKey;
let shortlink = environment.production?environment.productionshortlink:environment.sandboxshortlink;

//declare var foo;
//declare var merged;
//let  rambitcore = merged.rambitcore;


@Injectable()
export class UtilityService {


  constructor( public http: Http, public logger: Logger ) {

  }
 
  getchecksum1 (data) {
/*
  this.logger.log("Sent data = " + data);
  var md5 = merged.stdcrypto.createHash('md5').update(data).digest("hex");
  this.logger.log("md5 = " + md5);
  return md5;
*/
}

  randomString(length) {  
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
 }
 
  randomHex(length) {
    var text = "";
    var possible = "ABCDEF0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
 }


  getRandomPubkey(){
 //   var keyPair = foo.bitcoin.ECPair.makeRandom();
//    return keyPair.getPublicKeyBuffer().toString('hex');
/*
    var privateobject = rambitcore.privateKey();
    return privateobject.toPublicKey();
*/

  }

  getShortDirectPayLink(longlink: string) {
  
   var url = "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key="+firebasewebapikey; 
     return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

    var longdata = {
   "longDynamicLink": shortlink + "/?link="+longlink,
    "suffix": {
     "option": "UNGUESSABLE"
   }
     };

     this.http.post(url ,JSON.stringify(longdata), {headers: headers}) //.map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });



   }

}
