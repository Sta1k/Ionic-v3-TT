import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { DataProvider } from '../../providers/data/data';
import 'rxjs/add/operator/toPromise';
/**
 * Generated class for the TasksPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html',
})
export class TasksPage {
userTasks:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider,
    public data: DataProvider) {
  }
  ionViewWillEnter(){
    this.userTasks=this.data.userTasks;
    console.log(this.userTasks)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TasksPage');
  }
openTask(id){
  console.log(id)
}
}
