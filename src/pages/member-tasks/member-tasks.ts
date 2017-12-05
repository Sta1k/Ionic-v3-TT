import { Component } from '@angular/core';
import { IonicPage, ToastController,NavController, NavParams, PopoverController, Events, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { DataProvider } from '../../providers/data/data';
import { SingleTaskPage } from '../single-task/single-task'
import 'rxjs/add/operator/toPromise';
import * as _ from 'underscore';
import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
/**
 * Generated class for the TasksPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-member-tasks',
  templateUrl: 'member-tasks.html'
})
export class MemberTasksPage {
  userTasks: any;
  member
  interval
  constructor(
    private sms: SMS,
    private callNumber: CallNumber,
    private alert: AlertController,
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider,
    public data: DataProvider,
    public event: Events,
    public toast: ToastController) {
      // this.navParams.data
      // ?
      this.member=this.navParams.data;
      console.log(this.member)
      // :
      this.event.subscribe('member', (tasks) => this.userTasks = tasks)

  }
  response: any;
  ionViewWillEnter() {
    this.reqServ()

  }
  ngOnInit() {
    this.interval = setInterval(() => { this.reqServ() }, 60000);
  }
  ngOnDestroy() {
    this.interval ? clearInterval(this.interval) : console.log('no interval')
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad TasksPage');
  }
  call(num){
    !num?alert('Phone not found'):
    this.callNumber.callNumber(num, true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
  }
  callSms(num){
    this.sms.send(num,'test')
  }
  toggle(task) {
    this.api.toggleState(task.id)
      .subscribe((res) => {
        this.response = res.json()
        console.log(this.response)
        !this.response.started && this.response.success ?
          this.stop(task)
          :
          this.response.started && this.response.success ?
            this.start(task)
            :
            this.checkStarted()
      })
  }
  stop(task) {
    let result;
    let toast = this.toast.create({
      message:  `${task.name} stopped`,
      duration: 2000,
      position: 'bottom'
    });

    toast.present();
    this.data.clear();
    this.api.requestTasks(this.member.id).toPromise()
      .then(res => result = res.json())
      .then(result => {
        !result.success ? console.log(result) : this.bindData(result)
      })

  }
  start(task) {
    let result;
    let toast = this.toast.create({
      message: `${task.name}  started`,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
    task.current=true;
    this.api.requestTasks(this.member.id).toPromise()
    .then(res => result = res.json())
    .then(result => {
      !result.success ? console.log(result) : this.bindData(result)
    })
  }
  onDelete(task) {
    let result,
      alert = this.alert.create({
        title: 'Confirm Delete',
        message: 'Do you want to delete this task?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.api.taskDelete(task)
                .subscribe(res => {
                  result= res.json()
                  result.success?this.reqServ():console.log('error while deleting')
                })
            }
          }
        ]
      });
    alert.present();
  }
  onEdit(task) {
    let result;
    
    this.api.taskUpdate(task).subscribe((res)=>{
      result=res.json()
      console.log('Edit', result)
    })
  }
  reqServ() {
    let result;
    this.api.requestTasks(this.member.id).toPromise()
      .then(res => result = res.json())
      .then(result => {
        !result.success ? console.log(result) : this.bindData(result)
      })
  }
  bindData(r) {
    this.member=r.user
    this.data.memberTasks = r.tasks;
    this.userTasks = this.data.memberTasks;
    this.checkStarted();
  }

  checkStarted() {
    let obj: Object = _.findWhere(this.data.memberTasks, { current: true });
    console.log(this.data.memberTasks, obj)
    obj.hasOwnProperty('current') ? this.data.startOT(obj) : console.log('no active task')
  }
}
