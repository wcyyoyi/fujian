import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgaModule } from '../../theme/nga.module';
import { defineLocale } from 'ngx-bootstrap/bs-moment';
import { zhCn } from 'ngx-bootstrap/locale';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BsDatepickerModule } from 'ngx-bootstrap';

import { SurfaceService } from '../services';

import { routing } from './analyses.routing';
import { Analyses } from './analyses.component';

import { StatTables } from './components/statTables';
import { ExportService } from '../services/export.service';

defineLocale('zh-cn', zhCn);

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        routing,
        Ng2SmartTableModule,
        BsDatepickerModule.forRoot(),
    ],
    exports: [],
    declarations: [
        Analyses,
        StatTables
    ],
    providers: [
        SurfaceService,
        ExportService
    ],
})
export class AnalysesModule { 

}
