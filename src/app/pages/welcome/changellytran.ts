import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import {of as observableOf} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {environment} from '../config/environment';
import {webtestnetissueconfig, weblivenetissueconfig} from '../config/webissueconfig';



@Injectable({
  providedIn: 'root'
})
  

export class ChangellyTranService {

  public token: any;
  public url: string;


   constructor(public http: Http,
        public storage: Storage) {
        this.url = environment.hosteddomain ;
   }


   createTransactionEntry (details: any) {

     return new Promise((resolve, reject) => {


             this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');




            this.http.post(this.url + '/changely/createentry', JSON.stringify(details), {headers: headers})
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

