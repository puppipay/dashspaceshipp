import {Injectable, Pipe, PipeTransform} from '@angular/core';
import { ChangellyCalls } from '../../providers/changelly';


@Pipe({
  name: 'Redact'
})
export class RedactPipe implements PipeTransform {
  constructor( ) {
  }

  transform(item: string, args: any): string {
       if(item.length > 8) {
         var str1 = item.substring(0, 4);  
         var str2 = item.substring(8);  
         var newstr = str1 + "****" + str2;
         return newstr;
       } else if(item.length >4) {
         var str1 = item.substring(0, 4);  
         var newstr = str1 + "****"; 
         return str1;
      }  else return item;
    }

}

