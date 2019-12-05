import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ProductUpload } from './productUpload/productUpload.component';
import { UploadComponent } from './productUpload/upload/upload.component';
import { FileUploadService } from '../services/fileUpload.service';
import { AgmeDistService } from '../services/agmsDist.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ImgViewerModule } from '../businessComponent/imgView/imgViewer.module';
import { DisasterViewComponent } from './disasterview/disasterview.component';
import { ProdService } from '../services/product.service';
import { AgmeRealEleService } from '../services/agmeRealEle.service';
import { ImgAreaModal } from './agme/imgModal/imgArea.modal.component';
import { AgmeFileUploadComponent } from './agme/agmeFileUpload/agmeFileUpload.component';
import { AgmeComponent } from './agme/agme.component';
import { AgmeViewComponent } from './agmeView/agmeView.component';
import { BaModal } from '../../theme/components';
import { ConverterModule } from '../utils/Converter/converter.module';
import { YzNgxToastyModule, YzNgxGridModule, YzNgxIconModule } from 'yz-ngx-base/src';
import { zhCnLocale } from 'ngx-bootstrap/locale';
import { AgmeCliComponent } from './agmecli/agmeCli';
import { CliService } from '../services/cli.service';
import { NgxEchartsModule } from 'ngx-echarts';
defineLocale('zh-cn', zhCnLocale);

@NgModule({
    imports: [
        CommonModule,
        AngularFormsModule,
        NgaModule,
        routing,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        AreaChooseModule,
        FileUploadModule,
        TypeaheadModule.forRoot(),
        YzNgxGridModule.forRoot(),
        YzNgxIconModule.forRoot(),
        Ng2SmartTableModule,
        ImgViewerModule,
        ConverterModule,
        YzNgxToastyModule,
        ReactiveFormsModule,
        FormsModule,
        NgxEchartsModule
    ],
    exports: [],
    declarations: [
        Forms,
        DisasterComponent,
        AreaModal,
        ImgAreaModal,
        AgmeFileUploadComponent,
        DisasterViewComponent,
        FileUploadComponent,
        AgmeComponent,
        AgmeViewComponent,
        ProductUpload,
        UploadComponent,
        AgmeCliComponent
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
        AgmeDistService,
        ProdService,
        AgmeRealEleService,
        CliService
    ],
    entryComponents: [
        AreaModal,
        ImgAreaModal,
        BaModal,
    ],
})
export class FormModule {

}
