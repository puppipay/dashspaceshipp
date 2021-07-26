import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Logger } from './logger/logger';
import { changelib } from 'npmthechangelylib';
//import { stdcrypto } from 'npmthechangelylib';
import { environment } from '../pages/config/environment';




//import * as merged from 'npmthemergedlib';


import { Observable, of, throwError } from 'rxjs';


//import 'rxjs/add/operator/toPromise';

let network = environment.network;

declare var stdcrypto;
//declare var foo;
//declare var merged;
//let  foo = foo1.bitcoinlib;


@Injectable()
export class ChangellyCalls {
  algorithm = 'aes-256-cbc';
 
  random = 'c67b85e14a4875d75d0c15359b992276ad189ee6049ec01b33f962b9ac79b9d0'; 


  initstr = '                                ';

  key = '';
  key1 = '                ';
  password =  'test' ;// stdcrypto.buffer.Buffer.from(this.random, "hex"); 
  iv = stdcrypto.buffer.Buffer.alloc(16, 0); // crypto.randomBytes(16);  // Buffer.alloc(16, 0); // Initialization vector.

  token : any;

  mychangelly: any;
  url: string;
  apiKey = '813';
  apiSecret = '';

  private BTC_TO_SAT: number;
  btcRate : number;
  dashRate : number = 0.0;



  constructor(public http: Http, 
	public logger: Logger,
	public storage: Storage) {
  this.url = "https://api.changelly.com"

    this.SAT_TO_BTC = 1 / 1e8;
    this.BTC_TO_SAT = 1e8;
   
        this.storage.get(environment.storageuniq+'dashrate').then((value) => {
          if(value) {
          this.dashRate = Number(value);
          }
        });

  }

 public fromSatoshi(satoshis: number = 0): number {
    this.logger.log("ChangellyCalls : fromSatoshi: "+ satoshis);
    return satoshis * this.SAT_TO_BTC ;
  }
 public toSatoshi(data: number = 0): number {
    this.logger.log("ChangellyCalls : toSatoshi: "+ data);
    return data * this.BTC_TO_SAT ;
  }

 public toFiatDash(satoshis: number = 0): number {
    this.logger.log("ChangellyCalls : toFiatDash: "+ satoshis);
    return satoshis * this.SAT_TO_BTC * this.dashRate;
  }

  public fromFiatDash(amount: number = 0): number {
    this.logger.log("ChangellyCalls : toFiatDash : "+ amount);
    return (amount / this.dashRate  * this.BTC_TO_SAT);
  }

 public toFiatBtc(satoshis: number): number {
    this.logger.log("ChangellyCalls : toFiatBtc: "+ satoshis);
    return satoshis * this.SAT_TO_BTC * this.btcRate;
  }

  public fromFiatBtc(amount: number): number {
    this.logger.log("ChangellyCalls : fromFiatBtc : "+ amount);
    return (amount / this.btcRate  * this.BTC_TO_SAT);
  }


  getsign(message)
  {


    var sign = stdcrypto.crypto
   .createHmac('sha512', this.apiSecret)
   .update(JSON.stringify(message))
   .digest('hex');
    return sign;


  }

// https://codeforgeek.com/encrypt-and-decrypt-data-in-node-js/
// https://nodejs.org/api/crypto.html

  encryptcontract(text) {
  let cipher = stdcrypto.crypto.createCipheriv('aes-256-cbc', stdcrypto.buffer.Buffer(this.key), this.iv);
  let encrypted = cipher.update(text);
  encrypted = stdcrypto.buffer.Buffer.concat([encrypted, cipher.final()]);
  return   encrypted.toString('hex') ;
  }

  decryptcontract(text, pin) {
  this.key = pin + this.initstr.slice(pin.length);

  try {
  let encryptedText = stdcrypto.buffer.Buffer.from(text, 'hex');
  let decipher = stdcrypto.crypto.createDecipheriv('aes-256-cbc', stdcrypto.buffer.Buffer(this.key), this.iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = stdcrypto.buffer.Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
    } catch(err) {

  	alert("error="+err); 
    }
  }


  encrypt(text) {
  let cipher = stdcrypto.crypto.createCipheriv('aes-256-cbc', stdcrypto.buffer.Buffer.from(this.key), this.iv);
  let encrypted = cipher.update(text);
  encrypted = stdcrypto.buffer.Buffer.concat([encrypted, cipher.final()]);
  return   encrypted.toString('hex') ;
  }

  decrypt(text) {
  let encryptedText = stdcrypto.buffer.Buffer.from(text, 'hex');
  let decipher = stdcrypto.crypto.createDecipheriv('aes-256-cbc', stdcrypto.buffer.Buffer.from(this.key), this.iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = stdcrypto.buffer.Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
  }



  getDashRate(){

    return new Promise((resolve, reject) => {

          this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');

            var details = {};


            this.http.post(environment.hosteddomain + '/mobuser/getdashprice', JSON.stringify(details), {headers: headers})
              .subscribe(res => {
                let data = res.json();
                this.dashRate = Number(data[0].message);
                this.storage.set(environment.storageuniq+'dashrate', this.dashRate);
                resolve(this.dashRate);

              }, (err) => {
                 this.storage.get(environment.storageuniq+'dashrate').then((value) => {
                 this.dashRate = Number(value);
                   resolve(value);
                 });
              });

        });
        });



/*
    return new Promise((resolve, reject) => {
       var apilink = "https://chain.so/api/v2/get_price/DASH/USD"
      this.http.get(apilink )
//	.map(res=> res.json())
        .subscribe((res: any) => {
          if(res != null && res.data != null)
          this.dashRate = res.data.prices[0].price;
          this.storage.set(environment.storageuniq+"dashcoinrate", res);
          resolve(res);
        }, (err) => {
          this.storage.get(environment.storageuniq+"dashcoinrate").then(res=>{
          if(res != null && res.data != null)
          this.dashRate = res.data.prices[0].price;
          resolve(res);
          });
        });

    });
*/
  }


  getBtcRate(){
    return new Promise((resolve, reject) => {
       var apilink = "https://chain.so/api/v2/get_price/BTC/USD"
      this.http.get(apilink )
//	.map(res=> res.json())
        .subscribe((res: any) => {
          if(res != null && res.data != null)
          this.btcRate = res.data.prices[0].price;
          this.storage.set(environment.storageuniq+"bitcoinrate", res);
          resolve(res);
        }, (err) => {
          this.storage.get(environment.storageuniq+"bitcoinrate").then(res=>{
          if(res != null && res.data != null)
          this.btcRate = res.data.prices[0].price;
          resolve(res);
          });
        });

    });
  }

  getCurrencies(){

  var data = {
 	 "id": "test",
  	"jsonrpc": "2.0",
  	"method": "getCurrencies",
  	"params": {
  	}
  	} ;
    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('api-key', this.apiKey);
      headers.append('sign', this.getsign(data) );

      this.http.post(this.url ,JSON.stringify(data), {headers: headers})
//        .map(res => res.json())
        .subscribe((res: any) => {
          resolve(res._body);
          // resolve(res);
        }, (err) => {
          reject(err);
        });

    });

  }

  getMinAmount(from, to){

  var data = 
{
   "jsonrpc": "2.0",
   "id": "test",
   "method": "getMinAmount",
   "params": {
      "from": from,
      "to": to
   }
};

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('api-key', this.apiKey);
      headers.append('sign', this.getsign(data) );

      this.http.post(this.url ,JSON.stringify(data), {headers: headers})
//        .map(res => res.json())
        .subscribe((res: any) => {
          resolve(res._body);
          //resolve(res);
        }, (err) => {
          reject(err);
        });

    });

  }


  getExchangeAmount(from, to, amount){

  var data = 
{
   "jsonrpc": "2.0",
   "id": "test",
   "method": "getExchangeAmount",
   "params": {
      "from": from,
      "to": to,
      "amount": amount
   }
};

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('api-key', this.apiKey);
      headers.append('sign', this.getsign(data) );

      this.http.post(this.url ,JSON.stringify(data), {headers: headers})
//        .map(res => res.json())
        .subscribe((res: any) => {
          resolve(res._body);
        }, (err) => {
          reject(err);
        });

    });

  }


  createTransaction(from, to, destaddress, amount){

  var data = 
{
   "jsonrpc": "2.0",
   "id": "test",
   "method": "createTransaction",
   "params": {
      "from": from,
      "to": to,
      "address": destaddress,
      "amount": amount
   }
};

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('api-key', this.apiKey);
      headers.append('sign', this.getsign(data) );

      this.http.post(this.url ,JSON.stringify(data), {headers: headers})
//        .map(res => res.json())
        .subscribe((res: any) => {
          resolve(res._body);
          // resolve(res);
        }, (err) => {
          reject(err);
        });

    });

  }


  sendTransaction(data: any){
    
    if(network == "testnet") {
    return new Promise((resolve, reject) => {

    var sample = {
   "jsonrpc": "2.0",
   "id": "test",
   "result": {
      "id": "jev5lt0qmg26h48v",
      "apiExtraFee": "0",
      "changellyFee": "0.5",
      "payinExtraId": null,
      "payoutExtraId": null,
      "amountExpectedFrom": 1,
      "amountExpectedTo": 3.99,
      "status": "new",
      "currencyFrom": "eth",
      "currencyTo": "ltc",
      "amountTo": 0,
      "payinAddress": "doge address to send coins to",
      "payoutAddress": "valid ltc address",
      "createdAt": "2018-09-24T10:31:18.000Z"
     }
      };
       resolve(JSON.stringify(sample));

    });


    } else {

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('api-key', this.apiKey);
      headers.append('sign', this.getsign(data) );

      this.http.post(this.url ,JSON.stringify(data), {headers: headers})
//        .map(res => res.json())
        .subscribe((res: any) => {
          resolve(res._body);
          // resolve(res);
        }, (err) => {
          reject(err);
        });

    });

   }

  }

  




}
