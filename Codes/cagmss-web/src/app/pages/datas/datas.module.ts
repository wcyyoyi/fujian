import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap/bs-moment';
import { zhCn } from 'ngx-bootstrap/locale';
import { TabsModule, ModalModule } from 'ngx-bootstrap';
import { CKEditorModule } from 'ng2-ckeditor';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { routing } from './datas.routing';
import { Datas } from './datas.component';

import { SmartTables, IndexTable, CropTable } from './components/smartTables';
import { TimeSettings } from './components/timeSettings/timeSettings.component';
import { StationSettings } from './components/stationSettings/stationSettings.component';
import { FieldSettings, FieldCheckboxComponent } from './components/fieldSettings/fieldSettings.component';
import { IndexEditor, CropInfo, IndexTypeModal, AreaModal } from './components/editors';

import { DataState } from './datas.state';

// import { SurfaceService } from '../services/surface.service';
import { StationService, CropDictService, AreaService } from '../services';

import { DatasGuard } from '../guards';
import { ExportService } from '../services/export.service';
import { DateChooseComponent } from '../businessComponent/dateChoose/dateChoose.component';
import { AreaChoose } from '../businessComponent/areaChoose/areaChoose.component';
import { StationChoose, StaCheckboxViewComponent } from '../businessComponent/stationChoose/stationChoose.component';
import { FieldSettingModal } from './components/fieldSettings/fieldSettings.modal.component';
import { FieldSettingService } from './components/fieldSettings/fieldSettings.service';
import { StationSettingsModal } from './components/stationSettings/stationSettings.modal.component';
import { AreaChooseModule } from '../businessComponent/areaChoose/areaChoose.module';

defineLocale('zh-cn', zhCn);

@NgModule({
    imports: [
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
        MultiselectDropdownModule,
        AreaChooseModule
    ],
    exports: [],
    declarations: [
        Datas,
        SmartTables,
        TimeSettings,
        StationSettings,
        FieldSettings,
        IndexEditor,
        CropInfo,
        IndexTypeModal,
        IndexTable,
        CropTable,
        // AreaChoose,
        StaCheckboxViewComponent,
        FieldCheckboxComponent,
        StationChoose,
        DateChooseComponent,
        AreaModal,
        FieldSettingModal,
        StationSettingsModal
    ],
    entryComponents: [
        IndexTypeModal,
        //AreaChoose,
        // checkboxViewComponent,
        DateChooseComponent,
        AreaModal,
        FieldSettingModal,
        StationSettingsModal
    ],
    providers: [
        DatePipe,
        DatasGuard,
        DataState,
        StationService,
        CropDictService,
        ExportService,
        AreaService,
        FieldSettingService
    ]
})

export class DatasModule {

}
