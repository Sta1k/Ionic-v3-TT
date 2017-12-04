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
  table: boolean = false;
  query={
    user: this.data.userId,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  }
  differ=0
  iter=0
  role = this.data.userType
  userList=_.pluck(this.data.statData.data, 'user')
  userData=_.findWhere(this.userList,{"id":this.data.userId})
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
      
      
      console.log('userList->',this.userList);
    this.selectMonth();
    this.api.requestStatistic(null).subscribe(res => {
      let resp = res.json()
      console.log(resp)
      let wh = _.where(this.userData.days, { day_type: 0 }).length * 8 * 60 * 60,
        sumHours = _.compact(_.pluck(this.userData.days, 'time'));
      sumHours ? this.iter = sumHours.reduce(function (sum, cur) {
        return Number(sum) + Number(cur)
      }) : this.iter = 0
      this.table = Boolean(this.iter)
      this.differ = wh - this.iter
    })
  }
search(){
  
  this.api.requestStatistic(this.query).subscribe(res => {
    let resp = res.json()
    console.log(resp)
    this.userData=resp.data[0].user
    let wh = _.where(this.userData.days, { day_type: 0 }).length * 8 * 60 * 60,
      sumHours = _.compact(_.pluck(this.userData.days, 'time'));
    sumHours ? this.iter = sumHours.reduce(function (sum, cur) {
      return Number(sum) + Number(cur)
    }) : this.iter = 0
    this.table = Boolean(this.iter)
    this.differ = wh - this.iter
  })
}
  ionViewWillEnter(){

  }
  ionViewDidLoad() {
    
    //console.log('Month: ');
  }
  changeUser(val) {
    console.log(val)
    this.query.user=val
  }
  changeMonth(val) {
    console.log(val)
    this.query.month=val
  }
  changeYear(val) {
    console.log(val)
    this.query.year=val
  }
  selectMonth() {
    let obj: any = _.findWhere(this.monthData, { id: new Date().getMonth() + 1 }).selected = true;
    console.log(obj)
    
  }
}
