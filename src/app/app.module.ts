import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MyApp } from './app.component';
import { SingleTaskPage } from '../pages/single-task/single-task';
import { TeamPage } from '../pages/team/team';
import { StatisticPage } from '../pages/statistic/statistic'
import { ContactsPage } from '../pages/contacts/contacts';
import { CreatePage } from '../pages/create/create';
import { OptionsPage } from '../pages/options/options';
import { CurrentteamPage } from '../pages/currentteam/currentteam';
import { LoginPage } from '../pages/login/login';
import { TasksPage } from '../pages/tasks/tasks';
// import {ApiService} from './shared/api.service'
import { OneSignal } from '@ionic-native/onesignal';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Database } from '../providers/db/db';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Device } from '@ionic-native/device';
import { IonicStorageModule } from '@ionic/storage';
import { ApiProvider } from '../providers/api/api';
import { DataProvider } from '../providers/data/data';
import { HeadComponent } from '../components/head/head';
import { PipesModule } from '../pipes/pipes.module'

@NgModule({
  declarations: [
    MyApp,
    SingleTaskPage,
    TeamPage,
    LoginPage,
    TasksPage,
    CurrentteamPage,
    StatisticPage,
    OptionsPage,
    CreatePage,
    ContactsPage,
    HeadComponent,
  
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    FormsModule,
    PipesModule,
    IonicStorageModule.forRoot()

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SingleTaskPage,
    TeamPage,
    LoginPage,
    TasksPage,
    CurrentteamPage,
    StatisticPage,
    OptionsPage,
    CreatePage,
    ContactsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Database,
    FingerprintAIO,
    Device,
    // Storage,
    OneSignal,
    HttpModule,
    ApiProvider,
    DataProvider,

  ]
})
export class AppModule {
}
