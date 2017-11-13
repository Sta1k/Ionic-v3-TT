import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TasksPage } from '../../pages/tasks/tasks'
/**
 * Generated class for the CurrentteamPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-currentteam',
  templateUrl: 'currentteam.html',
})
export class CurrentteamPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  team = this.navParams.data;
  ionViewDidLoad() {
    console.log('ionViewDidLoad CurrentteamPage');
  }
  showUser(user) {
    this.navCtrl.setRoot(TasksPage, user)
  }
}
