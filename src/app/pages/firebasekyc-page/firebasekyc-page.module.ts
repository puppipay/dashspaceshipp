import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FirebaseKycPage } from './firebasekyc-page';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';




@NgModule({
  declarations: [
    FirebaseKycPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
     RouterModule.forChild([
      {
        path: '',
        component: FirebaseKycPage
      }
    ])

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  
})
export class FirebaseKycPageModule {}
