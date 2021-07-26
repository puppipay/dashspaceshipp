import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SourcefundPage } from './sourcefund';
import { SourcefundPageRoutingModule } from './sourcefund-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SourcefundPageRoutingModule
  ],
  declarations: [
    SourcefundPage,
  ]
})
export class SourcefundModule { }
