import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the BrPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'br',
})
export class BrPipe implements PipeTransform {
 
  transform(value: string, ...args) {
    return value.replace(/ /,' <br>');
  }
}
