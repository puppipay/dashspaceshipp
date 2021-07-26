import {Injectable, Pipe, PipeTransform} from '@angular/core';
import { ChangellyCalls } from '../../providers/changelly';


@Pipe({
  name: 'ToFiatBtc'
})
export class ToFiatBtcPipe implements PipeTransform {
  constructor( public changellyCalls: ChangellyCalls) {
  }

  transform(item: number): number {
      return  this.changellyCalls.toFiatBtc(item);
    }

}

