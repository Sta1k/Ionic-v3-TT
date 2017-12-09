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
import { LoginPage } from '../pages/login/login';
import { TasksPage } from '../pages/tasks/tasks'
import { TeamPage } from '../pages/team/team';
import { StatisticPage } from '../pages/statistic/statistic'
import { CreatePage } from '../pages/create/create';
import { OptionsPage } from '../pages/options/options';
import 'rxjs/add/operator/toPromise';
import { Subscription } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation'
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'underscore';
@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  private onResume: Subscription;
  private onPause: Subscription;
  private touch_mes;
  @ViewChild('content') nav: NavController;

  public rootPage: any;

  pages: Array<{ title: string, component: any, img: string }>;

  constructor(private oneSignal: OneSignal,
    private device: Device,
    private faio: FingerprintAIO,
    private db: Database,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public data: DataProvider,
    private api: ApiProvider,
    private geo: Geolocation,
    public translate: TranslateService
  ) {
    translate.get('touch_mes').subscribe(
      value => { this.touch_mes = value })
    this.onResume = platform.resume.subscribe(() => {
      // do something meaningful when the app is put in the foreground
      console.log('app in foreground')
    });
    this.onPause = platform.pause.subscribe(() => {
      console.log('app in background')
      this.data.checkNotification();
    });
    // used for an example of ngFor and navigation
    this.pages = [
      { title: "menu_status_of_team", component: TeamPage, img: 'assets/img/ico/people.png' },
      { title: "menu_tasks", component: TasksPage, img: 'assets/img/ico/brief.png' },
      { title: "menu_create", component: CreatePage, img: 'assets/img/ico/plus.png' },
      { title: "menu_stat", component: StatisticPage, img: 'assets/img/ico/stat.png' },
      { title: "menu_pref", component: OptionsPage, img: 'assets/img/ico/gear.png' },
      { title: "menu_logout", component: LoginPage, img: 'assets/img/ico/logout.png' },
    ];
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.getPos();
      let result;

      this.initUser()
      this.db.checkFinger().then(v => this.data.finger = v);
      this.db.checkRemember().then(v => this.data.remember = v)
        .then((val) => this.data.finger
          ?
          this.fingerStart()
          :
          this.data.remember
            ?
            this.successRemember()
            :
            this.toLogin())
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
    this.db.readLang()
      .then(obj => this.initLang(obj))
      .catch(e => this.defaultLang(e))
  }
  toLogin() {
    console.log('to Login')
    this.openPage(LoginPage)
  }
  rememberStart() {

  }
  fingerStart() {
    this.faio.isAvailable()
      ?
      this.faio.show({
        clientId: 'Fingerprint-Demo',
        clientSecret: 'password', //Only necessary for Android
        disableBackup: true,  //Only for Android(optional)
        localizedFallbackTitle: 'Use Pin', //Only for iOS
        localizedReason: this.touch_mes //Only for iOS
      }).then(r => this.successRemember())
      : this.toLogin()
  }
  getPos() {
    // this.presentToast('App getting your Position')
    let options = {
      enableHighAccuracy: true
    };
    this.geo.getCurrentPosition(options)
      .then((position) => {
        console.log('Geolocation successful');
        // this.presentToast('Position saved')
        this.data.position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

      }).catch((error) => {
        console.log('Error getting location', error);
      });

  }
  getInformation() {
    this.api.requestStatistic(null)
      .subscribe(res => {
        this.data.statData = res.json()
        console.log(this.data.statData)
      })
  }
  openPage(page) {

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page);
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
    this.data.userLogin = user
    console.log('login', this.data.userLogin)
    return this.api.login(user)
      .toPromise()
      .then(res => result = res.json())
      .then(result => result.success
        ?
        this.setUserType(result)
        : console.log(result))
  }
  user;
  username;
  private setUserType(r) {
    let result

    this.data.userType = r.type;
    console.log('userType', this.data.userType)
    this.data.userId = r.id;
    this.api.requestTasks(false)
      .toPromise()
      .then(res => result = res.json())
      .then(result => result.success ?
        this.goToTasks(result, this.data.userType) :
        this.openPage(LoginPage))
  }
  private goToTasks(r, type) {

    this.data.userTasks = r.tasks;
    this.username = r.user.name;
    this.getInformation()
    this.data.AllWorkedTime = this.summa(_.pluck(this.data.userTasks, 'time'))
    console.log(this.data.userType, this.data.userType > 0)
    type > 0 ? this.openPage(TeamPage) : this.openPage(TasksPage);
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
  defaultLang(e) {
    console.log(e)
    this.translate.setDefaultLang(this.platform.lang())
    this.data.lang = this.platform.lang()
  }
  initLang(i) {
    console.log(i)
    if ((i !== undefined) && (i !== null)) {
      this.translate.setDefaultLang(i);
      this.data.lang = i
    } else {
      this.defaultLang({ e: null })
    }
  }

}
