import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SlicePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'slice',
})
export class SlicePipe implements PipeTransform {
  /**
   * Takes a value and makes it length 17 chars.
   */
  transform(value: string, ...args) {
   let out;
    value.length < 12?out = value:out = value.substring(0, 11) + '...'
    return out;
  }
}
