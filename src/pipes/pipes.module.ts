import { NgModule } from '@angular/core';
import { HeadTimePipe } from './head-time/head-time';
import { TimePipe } from './time/time';
import { SlicePipe } from './slice/slice';
@NgModule({
	declarations: [HeadTimePipe,
    TimePipe,
    SlicePipe],
	imports: [],
	exports: [HeadTimePipe,
    TimePipe,
    SlicePipe]
})
export class PipesModule {}
