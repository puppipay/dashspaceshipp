import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import {of as observableOf} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {environment} from '../config/environment';



@Injectable({
  providedIn: 'root'
})

export class SourcefundService {
  public token: any;
  url: string ;

  sendingmessages= [];
  sendtransactions= [];

  constructor(public http: Http, 

	public storage: Storage) {
      this.url = environment.hosteddomain ;

  }

  getsystemstatus (details: any) {


        return new Promise((resolve, reject) => {

            this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');


            this.http.post(this.url + '/mobuser/getsystemstatus', JSON.stringify(details), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });
        });

  }

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

  senduserrequest (details: any) {



        return new Promise((resolve, reject) => {

            this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');


            this.http.post(this.url + '/usersourcefund/mobsendsourcefundrequest', JSON.stringify(details), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });
        });

  }

  getrequestanswer ( details: any) {


        return new Promise((resolve, reject) => {

     this.storage.get(environment.storageuniq+'token').then((value) => {

             this.token = value;
             let headers = new Headers();
             headers.append('Authorization', this.token);
             headers.append('Content-Type', 'application/json');

            this.http.post(this.url + '/usersourcefund/mobgetrequestanswer', JSON.stringify(details), {headers: headers})
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
