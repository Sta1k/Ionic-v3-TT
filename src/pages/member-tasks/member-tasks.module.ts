import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberTasksPage } from './member-tasks';

@NgModule({
  declarations: [
    MemberTasksPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberTasksPage),
  ],
})
export class MemberTasksPageModule {}
