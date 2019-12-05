import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExportService } from '../services/export.service';

import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BsDatepickerModule, TabsModule ,defineLocale} from 'ngx-bootstrap';
import { SurfaceService } from '../services';
import { routing } from './analyses.routing';
import { Analyses } from './analyses.component';
import { ResultComponent } from './components/result/result.component';
import { ChartComponent } from './components/chart/chart.component';
import { SettingComponent } from './components/setting/setting.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxEchartsModule } from 'ngx-echarts';
import { BaModal } from '../../theme/components';
import { StationChooseModule } from '../businessComponent/stationChoose/stationChoose.module';
import { DateChooseModule } from '../businessComponent/dateChoose/dateChoose.module';
import { DictionaryModule } from '../utils/Dictionary.module';
import { ConverterModule } from '../utils/Converter/converter.module';
import { YzNgxToastyModule } from 'yz-ngx-base/src';
import { AnalyseState } from './analyses.state';
import { zhCnLocale } from 'ngx-bootstrap/locale';
defineLocale('zh-cn', zhCnLocale);

@NgModule({
    imports: [
        YzNgxToastyModule.forRoot(),
        CommonModule,
        FormsModule,
        NgaModule,
        routing,
        ModalModule.forRoot(),
        Ng2SmartTableModule,
        BsDatepickerModule.forRoot(),
        NgxEchartsModule,
        StationChooseModule,
        TabsModule.forRoot(),
        DateChooseModule,
        DictionaryModule,
        ConverterModule,
    ],
    exports: [],
    declarations: [
        Analyses,
        ResultComponent,
        ChartComponent,
        SettingComponent
    ],
    providers: [
        ExportService,
        SurfaceService,
        AnalyseState
    ],
    entryComponents: [
        BaModal
    ]
})
export class AnalysesModule {

}
