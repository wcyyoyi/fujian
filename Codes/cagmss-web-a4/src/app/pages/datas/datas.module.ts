import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { TabsModule, ModalModule } from 'ngx-bootstrap';
import { CKEditorModule } from 'ng2-ckeditor';
// import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { routing } from './datas.routing';
import { Datas } from './datas.component';

import { SmartTables, IndexTable, CropTable } from './components/smartTables';
import { TimeSettings } from './components/timeSettings/timeSettings.component';
import { IndexEditor, CropInfoComponent, IndexTypeModal, AreaModal } from './components/editors';
import { YzNgxToastyModule } from 'yz-ngx-base/src';
import { DataState } from './datas.state';
import { BsModalService } from 'ngx-bootstrap/modal';
// import { SurfaceService } from '../services/surface.service';
import { StationService, CropDictService, AreaService } from '../services';
import { BookMarkService } from '../services/bookMark.service';
import { DatasGuard } from '../guards';
import { ExportService } from '../services/export.service';
import { AreaChooseModule } from '../businessComponent/areaChoose/areaChoose.module';
import { BaModal } from '../../theme/components';
import { StationChooseModule } from '../businessComponent/stationChoose/stationChoose.module';
import { DateChooseModule } from '../businessComponent/dateChoose/dateChoose.module';
import { DictionaryService } from '../utils/Dictionary.service';
import { FieldSettingsModule } from '../businessComponent/fieldSetting/fieldSettings.module';
import { DictionaryModule } from '../utils/Dictionary.module';
import { ConverterService } from '../utils/Converter/converter.service';
import { ConverterModule } from '../utils/Converter/converter.module';
import { DetailComponent } from './components/detail/detail.component';
import { MarkContentComponent } from './components/markContent/markContent.component';
import { StationSelectComponent } from './components/stationSelect/stationSelect.component';
import { MetaService } from '../services/meta.service';
import { ProdService } from '../services/product.service';
import { zhCnLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap';
defineLocale('zh-cn', zhCnLocale);

@NgModule({
    imports: [
        YzNgxToastyModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        CommonModule,
        AngularFormsModule,
        ReactiveFormsModule,
        NgaModule,
        routing,
        Ng2SmartTableModule,
        CKEditorModule,
        AreaChooseModule,
        StationChooseModule,
        DateChooseModule,
        FieldSettingsModule,
        ConverterModule
    ],
    exports: [],
    declarations: [
        MarkContentComponent,
        Datas,
        SmartTables,
        TimeSettings,
        IndexEditor,
        CropInfoComponent,
        IndexTypeModal,
        IndexTable,
        CropTable,
        AreaModal,
        DetailComponent,
        StationSelectComponent
    ],
    entryComponents: [
        DetailComponent,
        IndexTypeModal,
        AreaModal,
        BaModal,
        MarkContentComponent
    ],
    providers: [
        ProdService,
        MetaService,
        DatePipe,
        DatasGuard,
        DataState,
        ExportService,
        AreaService,
        BsModalService,
        BookMarkService
    ]
})

export class DatasModule {

}
