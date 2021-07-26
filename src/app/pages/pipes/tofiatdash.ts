import {Injectable, Pipe, PipeTransform} from '@angular/core';
import { ChangellyCalls } from '../../providers/changelly';


@Pipe({
  name: 'ToFiatDash'
})
export class ToFiatDashPipe implements PipeTransform {
  constructor( public changellyCalls: ChangellyCalls) {
  }

  transform(item: number): number {
      return  this.changellyCalls.toFiatDash(item);
    }

}

