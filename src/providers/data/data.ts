import { Injectable, Input, Output } from '@angular/core';
import { Events } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Http } from '@angular/http';
import { Task } from '../../app/shared/classes'
import 'rxjs/add/operator/map';
import * as _ from 'underscore';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataProvider {

  constructor(public http: Http, public events: Events, private localNotifications: LocalNotifications) {
    console.log('DataProvider Loaded');
    this.events.subscribe('update', (tasks) => this.userTasks = tasks)
  }
  statData;
  userId;
  userType: any;
  position:any;
  userList: any;
  memberTasks:any;
  userTasks: any;
  userLogin: any;
  AllWorkedTime;
  Timer: any;
  lang: any;
  finger: boolean = false;
  clear() {
    clearInterval(this.Timer);
  }
  clearData(){
    this.userId=undefined;
    this.statData=undefined;
    this.userTasks=undefined;
    this.userType=undefined;
    this.userLogin=undefined;
    
  }
  startOT(task) {
    let obj: any = _.findWhere(this.memberTasks, { id: task.id });

    this.Timer = setInterval(() => {
      obj.time++
      let arr = _.pluck(this.memberTasks, 'time')
      this.summa(arr)
      this.events.publish('member', this.memberTasks)
    }, 1000)
  }
  startTimer(task) {
    let obj: any = _.findWhere(this.userTasks, { id: task.id });

    this.Timer = setInterval(() => {
      obj.time++
      let arr = _.pluck(this.userTasks, 'time')
      this.summa(arr)
      this.events.publish('update', this.userTasks)
      this.events.publish('updHead', this.AllWorkedTime)
    }, 1000)
  }
  summa(m) {
    for (var s = 0, k = m.length; k; s += m[--k]);
    this.AllWorkedTime = s;
  }
  checkNotification() {
    let obj = _.findWhere(this.userTasks, { current: true }),
      t = this.getDate(),
      now = t.h + ':' + t.m;
    if (obj == undefined && now == '10:15') this.forgetTurnOn();
    else if (obj && now == '19:15') this.forgetTurnOff();
  }
  getDate() {
    return {
      m: new Date().getMinutes(),
      h: new Date().getHours()
    }
  }
  forgetTurnOn() {
    this.localNotifications.schedule({
      id: 1,
      title: 'Iterius Notification',
      text: 'Вы забыли включить трекер?',
      every: 'none'
    });
  };
  forgetTurnOff() {
    this.localNotifications.schedule({
      id: 2,
      title: 'Iterius Notification',
      text: 'Вы забыли выключить трекер?',
      every: 'none'
    });
  }
}