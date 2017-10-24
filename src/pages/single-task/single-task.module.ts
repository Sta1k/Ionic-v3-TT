import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleTaskPage } from './single-task';

@NgModule({
  declarations: [
    SingleTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleTaskPage),
  ],
})
export class SingleTaskPageModule {}
