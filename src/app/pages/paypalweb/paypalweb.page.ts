import { Component, OnInit } from '@angular/core';
import { PayPalFunding, PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
import { environment } from '../config/environment';
import { Storage } from '@ionic/storage';

import { PlatformProvider } from '../../providers/platform/platform';
import { Events } from '@ionic/angular';
import { Logger } from '../../providers/logger/logger';


let paypalnetwork = environment.paypalnetwork;


@Component({
        selector: 'paypalweb-page',
	templateUrl: 'paypalweb.html'
})

// 'AXNnbd5G4mTU34GPNNanfShMnNFHnZaCzPeA0iN3FJbkEaX7NTwLjpIK7dmnuLlkesUBGTdPqLIpSSZm'
export class PayPalWebPage implements OnInit {
    
    itemselected : any; 
    userinfoready: boolean= false;
    private myconfig: any;
    itemplans = [
       {
	plan: "subscribed",
	plandescription: "Test 100 plan",
	description: "Provides 10 message processing at 50% discount on fees. This discount applies to sending and receiving messages for 10 days. Not applicable to insta message sent",
        price: 100,
        days: 10,
        transactions: 10,
        unit: "USD",
      },
       {
	plan: "subscribed",
	plandescription: "Test 200 plan",
	description: "Provides 20 message processing at 50% discount on fees. This discount applies to sending and receiving messages for 20 days. Not applicable to insta messages sent ",
        price: 200,
        days: 20,
        transactions: 20,
        unit: "USD",
       },
       {
	plan: "subscribed",
	plandescription: "Test 500 plan",
	description: "Provides 50 message processing at 50% discount on fees. This discount applies to sending and receiving messages for 50 days. Not applicable to insta messages sent ",
        price: 500,
        days: 50,
        transactions: 50,
        unit: "USD",
       }
    ];


    public payPalConfig?: PayPalConfig;
    keyobj : any;
    constructor(
                //public alertCtrl: Popservice,
                private storage: Storage,
                private events: Events,
                private logger: Logger,

    ) {
     this.onEntryWork() ;
/*
      if(this.userinfo && this.userinfo.myuserinfo) {
        if(this.userinfo.myuserinfo.activeplanname == 'expired'){

        }
      }
*/
/*
 planstartdate: string;
       activeplanfixesfees: string;
       activeplanvariabefees: string;
       planenddate: string;

*/
    }

  onEntryWork() {
//    this.userinfo.storeRestore();
  }

    ionViewDidEnter() {
     this.onEntryWork() ;
 
    }

    activateplan() {
        var plan = {
 	activeplanname: this.itemselected.plan,
 	activeplandescription: this.itemselected.plandescription,
 	planstartdate: Date.now().toString(),
       activeplanfixedfees: 0.00001,
       activeplanvariablefees: 4,
       plandays: this.itemselected.plandays,
       plantransactions: this.itemselected.plantransactions,

        };
//	this.userinfo.updatePlanTaken(plan);

    }
   
    select(item) {
      this.itemselected = item;

      var a =  {
                amount: { 
                total: this.itemselected.price,
                currency: this.itemselected.unit,
                },
 		description: this.itemselected.plan,
         };

      this.myconfig.transactions.length = 0;
      this.myconfig.transactions.push(a);
      this.initConfig(this.myconfig);
      // this.popservice.presentAlert("Make payment below");
    }

   initselect(item) {
      this.itemselected = item;

      var a =  {
                amount: {
                total: this.itemselected.price,
                currency: this.itemselected.unit,
                },
                description: this.itemselected.plan,
         };

      this.myconfig.transactions.length = 0;
      this.myconfig.transactions.push(a);
      this.initConfig(this.myconfig);
    }


    ngOnInit(): void {

    

    if(paypalnetwork == "sandbox") {
        this.keyobj = {
            sandbox: environment.payPalEnvironmentSandbox
        };

    } else {
      this.keyobj = {
            production: environment.payPalEnvironmentProduction
      };
    }
    
    this.myconfig = {
          commit: true,
          client: this.keyobj,

/*{
	      sandbox:
 'AXNnbd5G4mTU34GPNNanfShMnNFHnZaCzPeA0iN3FJbkEaX7NTwLjpIK7dmnuLlkesUBGTdPqLIpSSZm'
//            production:
//              'AVjh_x-F8Gh-pNDiqytQ-srUd2evg26mtCqU3AbnVY_pHJvsgC9V2gRgXj_2jt6cDmO2SsHdekfoBSQ3'
          },
*/
          button: {
            label: 'paypal',
            layout: 'vertical'
          },
          experience: {
            noShipping: true,
            brandName: 'PuppiPay'
          },
          funding: {
            allowed: [
			PayPalFunding.Card,  
			PayPalFunding.Credit,  
			PayPalFunding.Elv,  
                     ]
          },
          onPaymentComplete :  (data, actions) => {
            this.logger.log("OnPaymentComplete:" + JSON.stringify(data));
            this.logger.log("OnPaymentComplete:" + JSON.stringify(actions));
            this.activateplan() ;
            this.logger.log('OnPaymentComplete');
          },
          transactions: [
            {
              amount: {
                total: 30,
                currency: 'USD',
              },
              description: 'testing',
           }
          ],
          note_to_payer: 'Contact us if you have troubles processing payment'
        };
     this.initselect(this.itemplans[0]); 

//    this.activateplan() ;
    }

    onValueChange() {

    }

    private initConfig(config): void {
      this.logger.log(config);
    if(paypalnetwork == "sandbox") {
      this.payPalConfig = new PayPalConfig(
        PayPalIntegrationType.ClientSideREST,
//        PayPalEnvironment.Production,
        PayPalEnvironment.Sandbox,
        config
      );
     } else {
        this.payPalConfig = new PayPalConfig(
        PayPalIntegrationType.ClientSideREST,
        PayPalEnvironment.Production,
//        PayPalEnvironment.Sandbox,
        config
      );


     }
    }
    onPaymentComplete1(data, actions) 
    {
 // go to next screen
// update plan 
    this.activateplan() ;
            this.logger.log('OnPaymentComplete');
    }
  
  }
  

/*
          onPaymentComplete: (data, actions) => {
            this.logger.log('OnPaymentComplete');
          },
          onCancel: (data, actions) => {
            this.logger.log('OnCancel');
          },
          onError: err => {
            this.logger.log('OnError');
          },
          onClick: () => {
            this.logger.log('onClick');
          },
          validate: (actions) => {
            this.logger.log(actions);
          }, */
