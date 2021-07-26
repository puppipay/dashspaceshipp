import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import {of as observableOf} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {environment} from '../config/environment';
import {webtestnetconsumeconfig, weblivenetconsumeconfig} from '../config/webconsumeconfig';





@Injectable({
  providedIn: 'root'
})

export class Blue011ConsumeService {
  public token: any;
  url: string ;

  receivedmessages= [];
//  transactions= [];
  receivetransactions= [];

  constructor(public http: Http, 
        
        public storage: Storage) {
     this.url = environment.hosteddomain ;
     this.loadreceivedmessages() ;
     this.loadreceivetransactions() ;
  }


  savereceivedmessage (details: any) {
    if(details != null) {
      this.receivedmessages.push(details);
      this.storage.set(environment.storageuniq+'receivedmessages',this.receivedmessages);
    }
  }

  deleteallmessage() {
      this.receivedmessages.length = 0;
      this.storage.set(environment.storageuniq+'receivedmessages',this.receivedmessages);
 }

 updatereceivedmessage(revert, transacted ) {

     for(var i=0; i< this.receivedmessages.length ; i++) {
         if(revert.pin == this.receivedmessages[i].pin) {
           this.receivedmessages[i].id =  transacted.fromaddress.substr(-5);
           this.receivedmessages[i].fromaddress = transacted.fromaddress;
           this.receivedmessages[i].status = 'received';
           this.receivedmessages[i].amount = transacted.amount;
           this.receivedmessages[i].fees = transacted.fees;
           this.receivedmessages[i].txid = transacted.txid;
         }
     }
      this.storage.set(environment.storageuniq+'receivedmessages',this.receivedmessages);

 }

  savereceivetransaction (details: any) {
    if(details != null) {
      this.receivetransactions.push(details);
      this.storage.set(environment.storageuniq+'receivetransactions',this.receivetransactions);
    }
  }

 clearreceiveall() {

      this.receivetransactions.length = 0;
      this.storage.set(environment.storageuniq+'receivetransactions',this.receivetransactions);
 }

  loadreceivetransactions() {
      this.storage.get(environment.storageuniq+'receivetransactions').then((data)=> {
	if(data) {
        this.receivetransactions = data;
        }
      });
  }

  loadreceivedmessages() {
      this.storage.get(environment.storageuniq+'receivedmessages').then((data)=> {
	if(data) {
        this.receivedmessages = data;
        }
      });

  }

  getreceivetransactions() {
    return this.storage.get(environment.storageuniq+'receivetransactions');
  }


  
  getreceivedmessages() {
    return this.storage.get(environment.storageuniq+'receivedmessages');
  }

  registerwif(details: any) {



        return new Promise((resolve, reject) => {


           this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');



            this.http.post(this.url + '/mobuser/registerwif', JSON.stringify(details), {headers: headers})
              .subscribe(res => {
                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });
        });

  }

/*
  getkycdata(details: any) {



        return new Promise((resolve, reject) => {


             this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');




            this.http.post(this.url + '/mobuser/getkycdata', JSON.stringify(details), {headers: headers})
              .subscribe(res => {
                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });
        });

  }

*/
  consumemessage (details: any) {



        return new Promise((resolve, reject) => {


             let headers = new Headers();

            if(details.network == 'testnet'){
                headers.append('Authorization', webtestnetconsumeconfig.apikey);
            }else {
                headers.append('Authorization', weblivenetconsumeconfig.apikey);

            }
             headers.append('Content-Type', 'application/json');

            this.http.post(this.url + '/blue011/consumemessage', JSON.stringify(details), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }

  getconsumefees (details: any) {



        return new Promise((resolve, reject) => {


             let headers = new Headers();

            if(details.network == 'testnet'){
                headers.append('Authorization', webtestnetconsumeconfig.apikey);
            }else {
                headers.append('Authorization', weblivenetconsumeconfig.apikey);

            }
             headers.append('Content-Type', 'application/json');

            this.http.post(this.url + '/blue011/getconsumefees', JSON.stringify(details), {headers: headers})
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



}
