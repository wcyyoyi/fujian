import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { AreaChooseModule } from '../businessComponent/areaChoose/areaChoose.module';
import { ModalModule, defineLocale, BsDatepickerModule } from 'ngx-bootstrap';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { QualityComponent } from './quality.component';
import { routing } from './quality.routing';
import { CropStatService } from '../services/cropstat.service';
import { StationService, AreaService, YieldService, IndexEventService, CropDictService, SHourService, SurfaceService, ApiService } from '../services';
import { ConverterModule } from '../utils/Converter/converter.module';
import { WordService } from '../services/word.service';
import { ButtonsModule } from 'ngx-bootstrap';
import { ImageService } from '../services/image.service';
import { YzNgxGridModule, YzNgxMapModule } from 'yz-ngx-base/src';
import { JujubeComponent, JujubeModalContentComponent } from './components/Jujube/Jujube.component';
import { DictionaryService } from '../utils/Dictionary.service';
import { zhCnLocale } from 'ngx-bootstrap/locale';
import { YzNgxToastyModule } from 'yz-ngx-base/src';
import { AreaModal } from './components/area.modal.component';
defineLocale('zh-cn', zhCnLocale);
@NgModule({
  imports: [
    YzNgxToastyModule.forRoot(),
    YzNgxGridModule,
    YzNgxMapModule,
    ButtonsModule.forRoot(),
    AngularFormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    ModalModule.forRoot(),
    ConverterModule,
    AreaChooseModule,
  ],
  declarations: [
    QualityComponent,
    JujubeComponent,
    JujubeModalContentComponent,
    AreaModal
  ],
  entryComponents: [
    JujubeModalContentComponent,
    AreaModal
  ],
  providers: [
    SurfaceService,
    DictionaryService,
    ApiService
  ]
})

export class QualityModule {

}
