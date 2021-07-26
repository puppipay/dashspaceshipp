import { NgModule } from '@angular/core';


import { FromSatoshiPipe } from './fromsatoshi'
import { ToFiatPipe } from './tofiat'
import { RedactPipe } from './redact'
import { ToFiatBtcPipe } from './tofiatbtc'
import { ToFiatDashPipe } from './tofiatdash'

export const pipes = [
 ToFiatPipe,
 RedactPipe,
 ToFiatBtcPipe,
 ToFiatDashPipe,
    FromSatoshiPipe

];

@NgModule({
  declarations:[pipes],
  exports: [pipes]
})

export class PipesModule { }

