import { Component, ViewChild } from '@angular/core';
import { ApiProvider } from '../providers/api/api';
import { Nav, Platform, ToastController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Database } from "../providers/db/db"
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Device } from '@ionic-native/device';
import { DataProvider } from '../providers/data/data'
import { OneSignal } from '@ionic-native/onesignal';
import { SingleTaskPage } from '../pages/single-task/single-task';

import { LoginPage } from '../pages/login/login';
import { TasksPage } from '../pages/tasks/tasks'
import { TeamPage } from '../pages/team/team';
import {StatisticPage} from '../pages/statistic/statistic'
import { ContactsPage } from '../pages/contacts/contacts';
import { CreatePage } from '../pages/create/create';
import { OptionsPage } from '../pages/options/options';
import { CurrentteamPage } from '../pages/currentteam/currentteam';
import { User } from '../app/shared/classes'
import 'rxjs/add/operator/toPromise';
import { Subscription } from 'rxjs';
import * as _ from 'underscore';
@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  private onResume: Subscription;
  private onPause: Subscription;
  @ViewChild('content') nav: NavController;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  constructor(private oneSignal: OneSignal,
    private device: Device,
    private faio: FingerprintAIO,
    private db: Database,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public data: DataProvider,
    private api: ApiProvider,
  ) {
    this.onResume = platform.resume.subscribe(() => {
      // do something meaningful when the app is put in the foreground
      console.log('app in foreground')
   }); 
   this.onPause = platform.pause.subscribe(() => {
    console.log('app in background')
      this.data.checkNotification();
   });
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Team', component: TeamPage },
      { title: 'Tasks', component: TasksPage },
      { title: 'Create', component: CreatePage },
      { title: 'Statistic', component: StatisticPage },
      { title: 'Options', component: OptionsPage },
      { title: 'Contacts', component: ContactsPage },
      { title: 'Login', component: LoginPage },
    ];

  }
  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    
    this.onResume.unsubscribe();
    this.onPause.unsubscribe();
  }
  successRemember() {

    let result,
      user = {
        username: this.user.username.__zone_symbol__value,
        password: this.user.password.__zone_symbol__value
      }
      //this.username=this.user.username.__zone_symbol__value
    console.log(user)
    return this.api.login(user)
      .toPromise()
      .then(res => result = res.json())
      .then(result => result.success
        ?
        this.api.requestTasks(false)
          .toPromise()
          .then(res => result = res.json())
          .then(result => result.success ?
            this.goToTasks(result)
            :
            this.nav.setRoot(LoginPage))
        : console.log(result))


  }
  user;
  username;
  private goToTasks(r) {

    this.data.userTasks = r.tasks;
    this.username=r.user.name;
    this.data.AllWorkedTime=this.summa(_.pluck(this.data.userTasks, 'time'))
    this.nav.setRoot(TasksPage);
  }
  summa(m) {
    for (var s = 0, k = m.length; k; s += m[--k]);
    this.data.AllWorkedTime = s;
  }
  initUser() {
    return this.user = {
      username: this.db.getName(),
      password: this.db.getPass()
    }
    

  }
  initializeApp() {
    this.platform.ready().then(() => {

      let result;
      this.initUser()
      this.db.checkRemember()
        .then(
        val => val ? this.successRemember() : this.openPage(LoginPage),
        err => console.log('Error', err))


      // .then(r=>user.username=r)
      // .then(()=>this.db.getPass()
      // .then(r=>{user.password=r;this.successRemember(user)}))
      //   .then(res => console.log(res))
      //   : console.log('log2'))
      //    this.api.requestTasks(false)
      //    .toPromise()
      //    .then(res => result = res.json())
      // .then(result => result.success ?
      //    this.data.userTasks = result.tasks 
      //    : 
      //    this.navCtrl.setRoot(LoginPage)) && console.log('Error: ', result): console.log('not true', val))
      // .then(res => this.navCtrl.setRoot(TasksPage)) 
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.faio.isAvailable() //&& this.device.platform == 'Android'
      //   ? this.faio.show({
      //     clientId: 'Fingerprint-Demo',
      //     clientSecret: 'password', //Only necessary for Android
      //     disableBackup: true,  //Only for Android(optional)
      //     localizedFallbackTitle: 'Use Pin', //Only for iOS
      //     localizedReason: 'Please authenticate' //Only for iOS
      //   })
      //   .then((result:any) => console.log(result))
      //   .catch((error:any) => console.log(error))
      //   : this.openPage(LoginPage);//console.log('IOS');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.oneSignal.startInit('77a9af35-365a-403f-9204-02f7370ac44e', '403307026230');
      
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
      
      this.oneSignal.handleNotificationReceived().subscribe(() => {
       // do something when notification is received
      });
      
      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });
      
      this.oneSignal.endInit();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

}
