import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgaModule } from '../../../theme/nga.module';
import { DateChooseComponent } from './dateChoose.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        NgaModule,
        FormsModule
    ],
    exports: [DateChooseComponent],
    declarations: [DateChooseComponent],
    providers: [],
})
export class DateChooseModule { }
