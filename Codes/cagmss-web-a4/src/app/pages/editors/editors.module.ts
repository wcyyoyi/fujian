import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgaModule } from '../../theme/nga.module';
import { YzNgxToastyModule } from 'yz-ngx-base/src';
import { ModalModule, defineLocale, BsDatepickerModule } from 'ngx-bootstrap';
import { routing } from './editors.routing';
import { Editors } from './editors.component';
import { Ckeditor } from './components/ckeditor/ckeditor.component';
import { WordService } from '../services/word.service';
import { ImageService } from '../services';
import { ProdService } from '../services/product.service';
import { ProdListComponent } from './prodList/prodList.component';
import { BaModal } from '../../theme/components';
import { GridImage } from './components/gridImage';

import { SurfaceService } from '../services';
import { AreaChooseModule } from '../businessComponent/areaChoose/areaChoose.module';
import { AreaModal } from './components/gridImage/areaChoose/area.modal.component';
import { SlimLoadingBarModule } from '../../../../node_modules/ng2-slim-loading-bar';
import { BrowserModule } from '../../../../node_modules/@angular/platform-browser';
import { EditorsGuard } from '../guards/editors.guard';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { zhCnLocale } from 'ngx-bootstrap/locale';
import { PdfViewModule } from '../businessComponent/pdfView/pdfViewer.modal.module';
import { PdfViewerModalComponent } from '../businessComponent/pdfView/pdfViewer.modal.component';
defineLocale('zh-cn', zhCnLocale);
@NgModule({
  imports: [
    PdfViewerModule,
    CommonModule,
    FormsModule,
    NgaModule,
    CKEditorModule,
    YzNgxToastyModule.forRoot(),
    ModalModule.forRoot(),
    routing,
    BsDatepickerModule.forRoot(),
    // BrowserModule,
    // SlimLoadingBarModule.forRoot(),
    AreaChooseModule,
    PdfViewModule
  ],
  declarations: [
    Editors,
    Ckeditor,
    ProdListComponent,
    GridImage,
    AreaModal,
  ],
  exports: [
  ],
  providers: [
    WordService,
    ImageService,
    ProdService,
    SurfaceService,
    EditorsGuard
  ], 
  entryComponents: [
    BaModal,
    AreaModal,
    PdfViewerModalComponent
  ]
})
export class EditorsModule {
}
