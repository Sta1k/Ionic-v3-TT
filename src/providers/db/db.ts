import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
// import { DataProvider } from '../data/data'
import 'rxjs/add/operator/map';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class Database {
  extdb;
  public constructor(public storage: Storage) { }

  writeRemember(uname, pass, remember) {
    this.storage.set('name', uname);
    this.storage.set('pass', pass);
    this.storage.set('remember', remember);
  }
  getName() {
    return this.storage.get('name')
  }
  getPass() {
    return this.storage.get('pass')
  }
  writeLang(lng) {
    this.storage.set('lang', lng);
  }
  readLang() {
    return this.storage.get('lang');
  }
  writeFinger(uname, pass, finger) {
    this.storage.set('name', uname);
    this.storage.set('pass', pass);
    this.storage.set('finger', finger);
  }
  checkRemember() {
    return this.storage.get('remember')
  }
  delRemember() {
    this.storage.set('remember', false);
  }
  checkFinger() {
    return this.storage.get('finger')
  }
  delFinger() {
    this.storage.set('finger', false);
  }

}
