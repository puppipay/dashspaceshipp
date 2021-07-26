import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SerlessettingPage } from './serlessetting';
import { PipesModule } from '../pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    SerlessettingPage,
  ],
  imports: [
    PipesModule,
    CommonModule,
    FormsModule,
    IonicModule,

      RouterModule.forChild([
      {
        path: '',
        component: SerlessettingPage
      }
    ])

  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SerlessettingPageModule {}
