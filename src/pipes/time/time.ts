import { Pipe, PipeTransform } from '@angular/core';
//import { DomSanitizer } from '@angular/platform-browser';
/**
 * Generated class for the TimePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  // constructor(private sanitizer: DomSanitizer) {
  // }
  
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
let out = `<div  class="hour">${h}<p>hrs.</p></div> <span>:</span> 
            <div class="hour">${m}<p>min.</p></div> <span>:</span>
            <div class="hour">${s}<p>sec.</p></div>`;
return  out;
  }
}
