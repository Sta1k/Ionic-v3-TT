import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { DataProvider } from '../../providers/data/data';
import { CurrentteamPage } from '../currentteam/currentteam'
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
  allUsers;
  allData;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public data: DataProvider) {

  }

  ionViewDidLoad() {
    let transformArr = (o) => {
      return { id: 255, title: 'All users', users: o };
    };
    console.log('ionViewDidLoad TeamPage');
    this.api.requestStatistic(null)
      .subscribe((res) => {
        this.allUsers = _.pluck(res.json().data, 'user')
        console.log('allusers', this.allUsers)
      });
    this.api.teamStatus()
      .subscribe((res) => {
        let r = _.toArray(res.json());
        this.allData = _.filter(r, (obj)=> {
          return !_.isArray(obj) 
        })
        
        this.allData.push({ id:255,
          title:'All Users',
          users:this.allUsers})
          console.log('All teams', this.allData)
      })
  }


 


  showTeam(team) {
    console.log(team)
    this.navCtrl.setRoot(CurrentteamPage, team)
  }
}
