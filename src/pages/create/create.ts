import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import * as _ from 'underscore';
/**
 * Generated class for the CreatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create',
  templateUrl: 'create.html',
})
export class CreatePage {
  model;
  userList=_.pluck(this.data.statData.data, 'user')
  constructor(public navCtrl: NavController, private data:DataProvider,public navParams: NavParams) {
    this.model=this.navParams.data
  }

  ionViewDidLoad() {
   
    console.log('CreatePage navparams',this.navParams);
  }

}
