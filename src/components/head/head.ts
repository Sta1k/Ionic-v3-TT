import { Component } from '@angular/core';

/**
 * Generated class for the HeadComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'headOn',
  templateUrl: 'head.html'
})
export class HeadComponent {

  text: string;

  constructor() {
    console.log('Hello HeadComponent Component');
    this.text = 'Hello World';
  }

}
