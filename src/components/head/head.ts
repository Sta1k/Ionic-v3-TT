import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data'
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

  time: any;

  constructor(public event: Events,public data: DataProvider) {
    this.time = Number(this.data.AllWorkedTime)||0;
    this.event.subscribe('updHead',(data)=>this.time=data)
  }
  
}
