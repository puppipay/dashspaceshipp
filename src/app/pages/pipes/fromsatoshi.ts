import {Injectable, Pipe, PipeTransform} from '@angular/core';
import { ChangellyCalls } from '../../providers/changelly';


@Pipe({
  name: 'FromSatoshi'
})

export class FromSatoshiPipe implements PipeTransform {
  constructor( public changellyCalls: ChangellyCalls) {
  }

  transform(item: number): number {
    //console.log(comp.toLowerCase());
      return  this.changellyCalls.fromSatoshi(item);
    }

}

