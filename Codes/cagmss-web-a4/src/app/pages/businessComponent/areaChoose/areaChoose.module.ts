import { NgModule } from '@angular/core';

import { AreaService } from '../../services';
import { AreaChoose } from './areaChoose.component';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../../theme/nga.module';
import { CropStatService } from '../../services/cropstat.service';

@NgModule({
    imports: [CommonModule, NgaModule],
    exports: [AreaChoose],
    declarations: [AreaChoose],
    providers: [AreaService,CropStatService],
})
export class AreaChooseModule { }
