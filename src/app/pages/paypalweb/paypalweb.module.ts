import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
//import { PayPal } from '@ionic-native/paypal';
import { RouterModule } from '@angular/router';


//import { IonicPageModule } from '@ionic/angular';
import { NgxPayPalModule } from 'ngx-paypal';

import { PayPalWebPage } from './paypalweb.page';

@NgModule({
	declarations: [
		PayPalWebPage
	],
  imports: [
    NgxPayPalModule,
     RouterModule.forChild([
      {
        path: '',
        component: PayPalWebPage
      }
    ])

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class PayPalWebModule {

}


