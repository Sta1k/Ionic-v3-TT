import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { DataProvider } from '../../providers/data/data';
import 'rxjs/add/operator/toPromise';
import * as _ from 'underscore';
/**
 * Generated class for the StatisticPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statistic',
  templateUrl: 'statistic.html',
})
export class StatisticPage {
  r
  table:boolean=false;
  differ
  iter
  role=this.data.userType
  userData
  userList: any[];
  monthData = [
    { id: 1, name: 'January', selected: false },
    { id: 2, name: 'February', selected: false },
    { id: 3, name: 'March', selected: false },
    { id: 4, name: 'April', selected: false },
    { id: 5, name: 'May', selected: false },
    { id: 6, name: 'June', selected: false },
    { id: 7, name: 'July', selected: false },
    { id: 8, name: 'August', selected: false },
    { id: 9, name: 'September', selected: false },
    { id: 10, name: 'October', selected: false },
    { id: 11, name: 'November', selected: false },
    { id: 12, name: 'December', selected: false }]
  year = new Date().getFullYear();
  yearData = [
    { name: this.year, selected: true },
    { name: this.year - 1, selected: false },
    { name: this.year - 2, selected: false }
  ]
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public data: DataProvider) {
    this.selectMonth();

  }

  ionViewDidLoad() {
    //console.log('Month: ');
  }
  changeUser(val) {
    console.log(val)
  }
  changeMonth(val) {
    console.log(val)
  }
  changeYear(val) {
    console.log(val)
  }
  selectMonth() {
    let obj: any = _.findWhere(this.monthData, { id: new Date().getMonth()+1 }).selected = true;
    console.log(obj)
    this.api.requestStatistic(null).subscribe(res => {
      this.r = res.json().data[0];
      console.log(this.r.user.days);
     let wh = _.where(this.r.user.days, {day_type: 0}).length * 8 * 60 * 60,
      sumHours=_.compact(_.pluck(this.r.user.days, 'time'));
      sumHours?this.iter=sumHours.reduce(function (sum, cur) {
        return Number(sum) + Number(cur)
      }):this.iter=0
      this.table=true
      this.differ=wh-this.iter
      // r.data.length>1?this.userList=r.data:
      // this.userData = [
      //   { name: r.data[0].user.name, 
      //     id: r.data[0].user.id, 
      //     selected: true }
      // ]

    })
  }
}
