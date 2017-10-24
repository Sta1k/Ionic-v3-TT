import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SingleTaskPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-single-task',
  templateUrl: 'single-task.html',
})
export class SingleTaskPage {

  constructor(public navCtrl: ViewController, public navParams: NavParams) {
  }
  task=this.navParams.data;
  
  ionViewDidLoad() {
    console.log(this.navParams);
  }

}
