import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../pipes/pipes.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3sendingPage } from './tab3sending.page';

@NgModule({
  imports: [
    IonicModule,
    PipesModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab3sendingPage }])
  ],
  declarations: [Tab3sendingPage ]
})
export class Tab3sendingPageModule {}
