import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the StatPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'stat',
})
export class StatPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    if (value < 0) {
      value = value * -1
    }
    if (!value) {
      return '0:00'
    }
    let h = (Math.floor(value / 3600)).toString(),
    m = (Math.floor(value / 60) % 60).toString()
   
if (Number(h) < 10)
  h = '0' + h;
if (Number(m) < 10)
  m = '0' + m;

let out = h + ':' + m ;
return out;
  }
}
