
import { NgModule } from '@angular/core';
import { FilterDataPipe } from './filter-data.pipe';

const PIPES = [
    FilterDataPipe
]

@NgModule({
    declarations: [
        PIPES
    ],
    exports: [
        PIPES
    ],
})

export class PipeModule { }