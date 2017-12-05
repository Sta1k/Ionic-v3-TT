import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the MemTimePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'memTime',
})
export class MemTimePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(num: any, ...args) {
    if (!num) {
      return 'not working'
    }
    let b = num * 1000,
     a = new Date(b),
     h = a.getHours().toString(),
     m = a.getMinutes().toString()
    if (Number(h) < 10)
      h = '0' + h;
    if (Number(m) < 10)
      m = '0' + m;
    num = h + ':' + m;
    return  num;
  }
}
