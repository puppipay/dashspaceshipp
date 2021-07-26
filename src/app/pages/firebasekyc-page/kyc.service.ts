import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import {of as observableOf} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {environment} from '../config/environment';
import {webtestnetissueconfig, weblivenetissueconfig} from '../config/webissueconfig';
import { kycStatus } from '../models/kycstatus.model';



@Injectable({
  providedIn: 'root'
})

export class KycService {
  public token: any;
  url: string ;

  sendingmessages= [];
  sendtransactions= [];
 
   kycstatus: kycStatus = {
    kycdone: '',
    kycid: '',
    googleid: '',
    email: '',
    statusaction: '',
    statusmsg: '',

  };
 

  constructor(public http: Http, public storage: Storage) {
      this.url = environment.hosteddomain ;

  }
  async getkycstatus() {
     var xx = await this.reflectkycstatus() ;

     return this.kycstatus;

  }


  reflectkycstatus() {
       return new Promise((resolve, reject) => {
      this.storage.get(environment.storageuniq+'kycstatus').then((data)=> {
        if(data) {
        this.kycstatus = data;
        }
        resolve(0);
      });

      })

  }

  registeruserkyc (details: any) {



        return new Promise((resolve, reject) => {

              this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');




            this.http.post(this.url + '/mobkycuser/registeruserkyc', JSON.stringify(details), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });
        });

  }

  getkycdata ( details: any) {


        return new Promise((resolve, reject) => {

              this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');




            this.http.post(this.url + '/mobkycuser/getuserkyc', JSON.stringify(details), {headers: headers})
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
