import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { DataProvider } from '../../providers/data/data';
import 'rxjs/add/operator/toPromise';
import * as _ from 'underscore';
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

  constructor(private api: ApiProvider,
    public data: DataProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: ToastController) {
  }
  task = this.navParams.data;
  response: any;
  ionViewDidLoad() {
    console.log(this.navParams);
  }
  toggle() {
    this.api.toggleState(this.task.id)
      .subscribe((res) => {
        this.response = res.json()
        console.log(this.response)
        !this.response.started && this.response.success ?
          this.stop()
          :
          this.response.started && this.response.success ?
            this.start()
            :
            this.checkStarted()
      })
  }
  stop() {
    let result;
    let toast = this.toast.create({
      message: 'Task stopped',
      duration: 2000,
      position: 'bottom'
    });

    toast.present();
    this.data.clear();
    this.api.requestTasks(false).toPromise()
      .then(res => result = res.json())
      .then(result => {
        !result.success ? console.log(result) : this.bindData(result)
      })

  }
  start() {
    let result;
    let toast = this.toast.create({
      message: 'Task started',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
    this.task.current=true;
    this.api.requestTasks(false).toPromise()
    .then(res => result = res.json())
    .then(result => {
      !result.success ? console.log(result) : this.bindData(result)
    })
  }
  bindData(r) {
    this.data.userTasks = r.tasks;
    this.checkStarted();
  }
  checkStarted() {
    let obj: any = _.findWhere(this.data.userTasks, { current: true });
    obj.hasOwnProperty('current') ? this.data.startTimer(obj) : console.log('no active task')
    obj.id === this.task.id ? this.task = obj : console.log('Something went wrong')
  }
}
