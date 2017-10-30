import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Events } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { DataProvider } from '../../providers/data/data';
import { SingleTaskPage } from '../single-task/single-task'
import 'rxjs/add/operator/toPromise';
import * as _ from 'underscore';
/**
 * Generated class for the TasksPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html'
})
export class TasksPage {
  userTasks: any;
  interval
  constructor(
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider,
    public data: DataProvider,
    public event: Events) {
    this.event.subscribe('update', (tasks) => this.userTasks = tasks)
    
  }
  
  ionViewWillEnter() {
    this.reqServ()

  }
  ngOnInit(){
    this.interval= setInterval(()=>{this.reqServ()},60000);
  }
  ngOnDestroy(){
    this.interval?clearInterval(this.interval):console.log('no interval')
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad TasksPage');
  }
  openTask(task) {
    console.log(task)
    let popover = this.popoverCtrl.create(SingleTaskPage, task);
    popover.present({
      //task: task
    });
  }
  
  reqServ() {
    let result;
    this.api.requestTasks(false).toPromise()
      .then(res => result = res.json())
      .then(result => {
        !result.success?console.log(result):this.bindData(result)
       })
  }
  bindData(r){
    this.data.userTasks=r.tasks;
    this.userTasks=this.data.userTasks;
    this.checkStarted();
  }

  checkStarted() {
    let obj: Object = _.findWhere(this.data.userTasks, { current: true });
    console.log(this.data.userTasks, obj)
    obj.hasOwnProperty('current') ? this.data.startTimer(obj) : console.log('no active task')
  }
}
