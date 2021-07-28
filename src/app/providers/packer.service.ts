import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
//import 'rxjs/add/operator/map';
import {of as observableOf} from 'rxjs';
import {map, tap} from 'rxjs/operators';

//import * as merged from 'npmthemergedlib';


@Injectable({
  providedIn: 'root'
})
export class PackerService {
  public token: any;
  url: string = "http://localhost:1337";
  apiKey = '';
  apiSecret = '';

  constructor(public http: Http, public storage: Storage) {
    this.url = "http://localhost:1337";
  }

  getsecret (details: any) {


        return new Promise((resolve, reject) => {

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            this.http.post(this.url + '/create', JSON.stringify(details), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }

  findpayments (details: any) {


        return new Promise((resolve, reject) => {

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            this.http.post(this.url + '/findpayments', JSON.stringify(details), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }



  makepayment (details: any) {


        return new Promise((resolve, reject) => {

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            this.http.post(this.url + '/makepayment', JSON.stringify(details), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }
 
  getsign(message)
  {
/*
    var sign = merged.stdcrypto
   .createHmac('sha512', this.apiSecret)
   .update(JSON.stringify(message))
   .digest('hex');
    return sign;
*/
  }
/*
   getMessage(greet:string, amount: number){

   var data = {
         "id": "test",
        "jsonrpc": "1.1",
        "method": "getMessage",
        "params": {
         shorturl: true,
         parturl: true,
         directurl: true,
         greeting: greet,
	 amount: amount
        }
        } ;
    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('api-key', this.apiKey);
      headers.append('sign', this.getsign(data) );

      this.http.post(this.url ,JSON.stringify(data), {headers: headers})
        .pipe( map(res => res.json()),
         tap (res => { resolve(res); }),
        );
            
  });

 }


// encash url, direct, part, similar
   encashMessage(message:string, pin: string, address: string){

   var data = {
         "id": "test",
        "jsonrpc": "1.1",
        "method": "encashMessage",
        "params": {
         message: message,
         pin: pin,
	 address: address
        }
        } ;
    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('api-key', this.apiKey);
      headers.append('sign', this.getsign(data) );

      this.http.post(this.url ,JSON.stringify(data), {headers: headers})
        .pipe( map(res => res.json()),
        tap(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
            
  });

 }
  
*/


}
