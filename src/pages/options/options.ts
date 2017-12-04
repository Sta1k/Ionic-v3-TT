import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data'
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Database } from "../../providers/db/db"
import * as _ from 'underscore';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the OptionsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-options',
  templateUrl: 'options.html',
})
export class OptionsPage {
  selected;
  langData = [
    { name: 'English', small: 'en', selected: false },
    { name: 'German', small: 'de', selected: false },
    { name: 'Russian', small: 'ru', selected: false }]
  constructor(private db: Database,
    private faio: FingerprintAIO,
    public data: DataProvider,
    public navCtrl: NavController,
    public event: Events,
    public navParams: NavParams,
      public translate:TranslateService) {
    this.check()
    this.selectLang()
  }
  checkbox = {
    checked: false
  };
  toggleState() {
    this.checkbox.checked ? this.checkboxOn() : this.checkboxOff()
  }
  check() {
    this.db.checkFinger()
      .then(val => this.checkbox.checked = val)
      .then(c => console.log('Checkbox', this.checkbox.checked))
  }
  checkboxOn() {
    console.log('on')
    this.faio.isAvailable() ?
      this.faio.show({
        clientId: 'Fingerprint-Demo',
        clientSecret: 'password', //Only necessary for Android
        disableBackup: true,  //Only for Android(optional)
        localizedFallbackTitle: 'Use Pin', //Only for iOS
        localizedReason: 'Please authenticate' //Only for iOS
      })
        .then((result: any) => this.db.writeFinger(this.data.userLogin.username, this.data.userLogin.password, true))
        .catch((error: any) => console.log(error)) : console.log('not available')
  }
  checkboxOff() {
    console.log('off')
    this.db.delFinger();
  }

  ionViewDidLoad() {
    console.log(this.data.lang);
  }
  changeLang(val: any) {
    this.db.writeLang(val)
    this.translate.use(val)
  }
  selectLang() {
    let obj: any = _.findWhere(this.langData, { selected: true });
    obj ? obj.selected = false : console.log('no obj')
    _.findWhere(this.langData, { small: this.data.lang }).selected = true
    this.db.writeLang(this.data.lang)
  }
}
