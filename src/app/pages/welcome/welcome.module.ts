import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { WelcomePage } from './welcome';
import { PipesModule } from '../pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { QRCodeModule } from 'angularx-qrcode';
import { IonicModule } from '@ionic/angular';







@NgModule({
  declarations: [
    WelcomePage,
  ],
  imports: [
    PipesModule,
    CommonModule,
    FormsModule,
    IonicModule,
    QRCodeModule,
     RouterModule.forChild([
      {
        path: '',
        component: WelcomePage
      }
    ]),


  ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WelcomePageModule {}
