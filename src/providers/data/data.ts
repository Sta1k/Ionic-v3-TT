import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as _ from 'underscore';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataProvider {

  constructor(public http: Http) {
    console.log('Hello DataProvider');
  }
  userType: any;
  userTasks: any;
  userLogin: any;
  AllWorkedTime;
  Timer;
  updateTaskTime(){
    return {
     
      StartTimer(task) {
        var obj = _.findWhere(this.userTasks, {id: task.id});
        this.Timer = setInterval(this.summaryTime, 1000);
      },
      StopTimer(task) {
        if (this.Timer) {
          clearInterval(this.Timer);
        }
      }
    }
  }
  summaryTime(obj) {
    obj.time++;
    let arr = _.pluck(this.userTasks, 'time');
    this.summa(arr);
  }
  summa(m) {
    for (var s = 0, k = m.length; k; s += m[--k]);
    this.AllWorkedTime = s;
  };
}
