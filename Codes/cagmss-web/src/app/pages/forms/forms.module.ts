import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule } from '@angular/forms';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './forms.routing';
import { Forms } from './forms.component';
import { DisasterComponent } from './disaster/disaster.component';
import { DisasterService } from '../services/disaster.service';
import { AreaService } from '../services/area.service';
import { BsModalService, BsModalRef, ModalModule, BsDatepickerModule, defineLocale, TypeaheadModule } from 'ngx-bootstrap';
import { AreaModal } from './disaster/modal/area.modal.component';
import { StationService, CropDictService } from '../services';
import { AreaChooseModule } from '../businessComponent/areaChoose/areaChoose.module';
import { FileUploadModule } from 'ng2-file-upload';
import { FileUploadComponent } from './disaster/fileUpload/fileUpload.component';
import { FileUploadService } from '../services/fileUpload.service';
import { AgmeDistService } from '../services/agmsDist.service';
import { zhCn } from 'ngx-bootstrap/locale';
import { DisasterViewComponent } from './disasterview/disasterview.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ImgViewerModule } from '../businessComponent/imgView/imgViewer.module';

defineLocale('zh-cn', zhCn);

@NgModule({
    imports: [
        CommonModule,
        AngularFormsModule,
        NgaModule,
        routing,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TypeaheadModule.forRoot(),
        AreaChooseModule,
        FileUploadModule,
        Ng2SmartTableModule,
        ImgViewerModule,
        ModalModule.forRoot(),
    ],
    exports: [],
    declarations: [
        Forms,
        DisasterComponent,
        AreaModal,
        FileUploadComponent,
        DisasterViewComponent
    ],
    providers: [
        DisasterService,
        AreaService,
        BsModalService,
        StationService,
        BsModalRef,
        BsModalService,
        CropDictService,
        FileUploadService,
        AgmeDistService
    ],
    entryComponents: [
        AreaModal,
    ],
})
export class FormsModule {

}
