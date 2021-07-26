import {Injectable, Pipe, PipeTransform} from '@angular/core';
import { ChangellyCalls } from '../../providers/changelly';


@Pipe({
  name: 'ToFiat'
})
export class ToFiatPipe implements PipeTransform {
  constructor( public changellyCalls: ChangellyCalls) {
  }

  transform(item: number): number {
      return  this.changellyCalls.toFiatBtc(item);
    }

}

