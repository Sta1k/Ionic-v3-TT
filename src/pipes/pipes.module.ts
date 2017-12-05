import { NgModule } from '@angular/core';
import { HeadTimePipe } from './head-time/head-time';
import { TimePipe } from './time/time';
import { SlicePipe } from './slice/slice';
import { StatPipe } from './stat/stat';
import { BrPipe } from './br/br';
import { MemTimePipe } from './mem-time/mem-time';
@NgModule({
	declarations: [HeadTimePipe,
    TimePipe,
    SlicePipe,
    StatPipe,
    BrPipe,
    MemTimePipe,
    MemTimePipe],
	imports: [],
	exports: [HeadTimePipe,
    TimePipe,
    SlicePipe,
    StatPipe,
    BrPipe,
    MemTimePipe,
    MemTimePipe]
})
export class PipesModule {}
