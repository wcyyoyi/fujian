import { NgModule } from '@angular/core';

import { AreaService } from '../../services';
import { AreaChoose } from './areaChoose.component';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../../theme/nga.module';

@NgModule({
    imports: [CommonModule, NgaModule],
    exports: [AreaChoose],
    declarations: [AreaChoose],
    providers: [AreaService],
})
export class AreaChooseModule { }
