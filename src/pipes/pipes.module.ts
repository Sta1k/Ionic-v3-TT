import { NgModule } from '@angular/core';
import { HeadTimePipe } from './head-time/head-time';
import { TimePipe } from './time/time';
import { SlicePipe } from './slice/slice';
import { StatPipe } from './stat/stat';
@NgModule({
	declarations: [HeadTimePipe,
    TimePipe,
    SlicePipe,
    StatPipe],
	imports: [],
	exports: [HeadTimePipe,
    TimePipe,
    SlicePipe,
    StatPipe]
})
export class PipesModule {}
