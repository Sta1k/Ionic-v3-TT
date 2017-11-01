import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { DataProvider } from '../../providers/data/data';
import 'rxjs/add/operator/toPromise';
import * as _ from 'underscore';
/**
 * Generated class for the TeamPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-team',
  templateUrl: 'team.html',
})
export class TeamPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public data: DataProvider) {
     
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TeamPage');
    this.api.requestStatistic(null).subscribe(res=>console.log(res))
  }
  showTeam() {

  }
}
