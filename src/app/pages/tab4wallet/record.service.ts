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

export class RecordService {
  public token: any;
  url: string ;


  constructor(public http: Http, 
        
        public storage: Storage) {
     this.url = environment.hosteddomain ;
  }


  recorddirectsend(details: any) {



        return new Promise((resolve, reject) => {


           this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');



            this.http.post(this.url + '/mobuser/mobrecorddirectsend', JSON.stringify(details), {headers: headers})
              .subscribe(res => {
                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });
        });

  }

   recordissuersend(details: any) {



        return new Promise((resolve, reject) => {


           this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');



            this.http.post(this.url + '/mobuser/mobrecordissuersend', JSON.stringify(details), {headers: headers})
              .subscribe(res => {
                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });
        });

  }

   recordreceive(details: any) {



        return new Promise((resolve, reject) => {


           this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');



            this.http.post(this.url + '/mobuser/mobrecordmsgreceive', JSON.stringify(details), {headers: headers})
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
