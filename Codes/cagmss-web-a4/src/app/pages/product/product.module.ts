import { NgModule } from '@angular/core';
import { YzNgxToastyModule } from 'yz-ngx-base/src';
import { Product } from './product.component';
import { routing } from './product.routing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { CarouselModule, TabsModule, ModalModule, AlertModule, TooltipModule } from 'ngx-bootstrap';
import { ProdService } from '../services/product.service';
import { HomePageComponent } from './homePage/homePage.component';
import { Display } from './display/display.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ExportService } from '../services/export.service';
import { WordService } from '../services/word.service';
import { AreaService } from '../services';
import { ImgViewerModalComponent } from '../businessComponent/imgView/imgViewer.modal.component';
import { ImgViewerModule } from '../businessComponent/imgView/imgViewer.module';
import { TableViewerModule } from '../businessComponent/tableView/tableView.module';
import { PdfViewModule } from '../businessComponent/pdfView/pdfViewer.modal.module';
import { WordViewerModule } from '../businessComponent/wordView/wordViewer.module';
import { WordViewerModalComponent } from '../businessComponent/wordView/wordViewer.modal.component';
import { AreaMenuComponent } from './areaMenu/areaMenu.component';
import { DictionaryModule } from '../utils/Dictionary.module';
import { FileUploadModule } from 'ng2-file-upload';
import { FileUploadService } from '../services/fileUpload.service';
import { BsModalService, BsModalRef, BsDatepickerModule, defineLocale, TypeaheadModule } from 'ngx-bootstrap';
import { zhCnLocale } from 'ngx-bootstrap/locale';
defineLocale('zh-cn', zhCnLocale);
@NgModule({
    imports: [
        YzNgxToastyModule.forRoot(),
        FileUploadModule,
        TableViewerModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgaModule,
        routing,
        CarouselModule.forRoot(),
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        AlertModule.forRoot(),
        TooltipModule.forRoot(),
        Ng2SmartTableModule,
        ImgViewerModule,
        WordViewerModule,
        PdfViewModule,
        DictionaryModule,
        ModalModule.forRoot(),
        TypeaheadModule.forRoot(),
        BsDatepickerModule.forRoot(),
    ],
    exports: [],
    declarations: [
        Display,
        HomePageComponent,
        Product,
        AreaMenuComponent,
    ],
    providers: [
        FileUploadService,
        ProdService,
        ExportService,
        WordService,
        AreaService,
        BsModalService,
        BsModalRef,
    ],
    entryComponents: [
        ImgViewerModalComponent,
        WordViewerModalComponent
    ],
})
export class ProductModule { }
