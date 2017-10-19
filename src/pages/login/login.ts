import { Component, /*OnInit*/ } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { DataProvider } from '../../providers/data/data';
import { Database } from '../../providers/db/db';
import { TasksPage } from '../tasks/tasks'
import 'rxjs/add/operator/toPromise';
import {User} from '../../app/shared/classes'


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage /*implements OnInit*/ {
  username: string = '';
  password: string = '';
  remember: boolean = false;

  constructor(public navCtrl: NavController,
    private api: ApiProvider,
    public data: DataProvider,
    private db: Database) {

  }

  onLogin(e: Event, login) {
    e.preventDefault();
    let result;
    let user = new User(this.username, this.password, this.remember);

    this.api.login(user)
      .toPromise()
      .then(res => result = res.json())
      .then(result => result.success
        ? user.remember ? this.toDb(user,result):this.delDb(result):
        console.log('Error: ', result))

    //.subscribe((event) => event.json())

  }
  toDb(user,result){
    this.db.writeRemember(user.username,user.password,user.remember);
    this.successLogin(result);
  }
  delDb(result){
    this.db.delRemember();
    this.successLogin(result);
  }
  successLogin(res) {
    this.data.userType = res;
    this.data.userType > 0
      ?
      this.navCtrl.setRoot('Home')
      :
      this.toTasks()
    //this.navCtrl.setRoot(TasksPage)
  }
  toTasks() {
    let result: any;
    this.api.requestTasks(false).toPromise()
      .then(res => result = res.json())
      .then(result => result.success ? this.data.userTasks = result.tasks : console.log('Error: ', result))
      .then(res => this.navCtrl.setRoot(TasksPage))
  }
  // ngOnInit(){
  //
  // }

}
