import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { QRCodeModule } from 'angularx-qrcode';



import { PaydisplaymodalPage } from './paydisplaymodal.page';

const routes: Routes = [
  {
    path: '',
    component: PaydisplaymodalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxQRCodeModule,
    QRCodeModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class PaydisplaymodalPageModule {}
