import { Component } from '@angular/core';

/**
 * Generated class for the HeadComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'headOn',
  templateUrl: 'head.html',
  //pipes:[]
})
export class HeadComponent {

  time: string;

  constructor() {
    console.log('Hello HeadComponent Component');
    this.time = '0';
  }

}
