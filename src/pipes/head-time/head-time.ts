import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the HeadTimePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'headTime',
})
export class HeadTimePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value, ...args) {

    let h = (Math.floor(value / 3600)).toString(),
        m = (Math.floor(value / 60) % 60).toString(),
        s = (value % 60).toString();
    if (Number(h) < 10)
      h = '0' + h;
    if (Number(m) < 10)
      m = '0' + m;
    if (Number(s) < 10)
      s = '0' + s;
    let out = h + ':' + m + ':' + s;
    return out;
  }
}
