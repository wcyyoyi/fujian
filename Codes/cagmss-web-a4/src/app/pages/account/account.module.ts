import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap';
import { NgaModule } from '../../theme/nga.module';
import { ProdService, } from '../services/product.service';
import { AgmeDistService, } from '../services/agmsDist.service';
import { ConverterService, } from '../utils/Converter/converter.service';
import { routing } from './account.routing';
import { Account } from './account.component';
import { ImgUploadComponent } from './components/userSetting/imgUpload/imgUpload.component';
import { BasicInfoComponent } from './components/userSetting/basic/basicInfo.component';
import { ChangePassComponent } from './components/userSetting/changePassword/changePassword.component';
import { CustomSettingComponent } from './components/userSetting/customSetting/customSetting.component';
import { DictionaryModule } from '../utils/Dictionary.module';
import { AddUserComponent } from './components/userSetting/addUser/addUser.component';
import { ChangeColorComponent } from './components/userSetting/changeColor/changeColor.component';
import { UserAreaModal } from './components/userSetting/addUser/areaChoose/area.modal.component';
import { AreaChooseModule } from '../businessComponent/areaChoose/areaChoose.module';
import { AreaChoose } from '../businessComponent/areaChoose/areaChoose.component';
import { AddUserGuard } from '../guards/addUser.guard';
import { AddAreaGuard } from '../guards/addArea.guard';
import { AddAreaComponent } from './components/areaSetting/addArea/addArea.component';
import { ImgSettingComponent } from './components/userSetting/imgSetting/imgSetting.component';
import { AreaViewComponent } from './components/areaSetting/areaView/areaView.component';
import { ModalManageComponent } from './components/configSetting/modalManage/modalManage.component';
import { SaveModalComponent } from './components/configSetting/saveModal/saveModal.component';
import { TemplateDetailComponent } from './components/configSetting/template/template.component';
import { AttentionEditComponent } from './components/configSetting/attentionEdit/attentionEdit.component';
import { BookMarkComponent } from './components/configSetting/bookMark/bookMark.component';
import { CacheSettingComponent } from './components/configSetting/cacheSetting/cacheSetting.component';
import { WarningDetailComponent } from './components/configSetting/warningDetail/warningDetail.component';
import { WarningComponent } from './components/configSetting/warning/warning.component';
import { DetailComponent } from './components/configSetting/detail/detail.component';
import { AddStationComponent } from './components/stationSetting/addStation/addStation.component';
import { StationViewComponent } from './components/stationSetting/stationView/stationView.component';
import { MasterplateService } from '../services/masterplate.service';
import { WarningService } from '../services/warning.service';
import { CKEditorModule } from 'ng2-ckeditor';
import { WordService } from '../services/word.service';
import { MetaService } from '../services/meta.service';
import { FileUploadService } from '../services/fileUpload.service';
import { BookMarkService } from '../services/bookMark.service';
import { FileUploadModule } from 'ng2-file-upload';
import { TooltipModule } from 'ngx-bootstrap';
import { BsModalService, BsModalRef, ModalModule, BsDatepickerModule, defineLocale, TypeaheadModule } from 'ngx-bootstrap';
import { zhCnLocale } from 'ngx-bootstrap/locale';
import { YzNgxToastyModule } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.module';
import { YzNgxGridModule } from 'yz-ngx-base/src';
defineLocale('zh-cn', zhCnLocale);
@NgModule({
    imports: [
        YzNgxToastyModule,
        YzNgxGridModule.forRoot(),
        TooltipModule.forRoot(),
        FileUploadModule,
        TabsModule.forRoot(),
        CKEditorModule,
        CommonModule,
        AngularFormsModule,
        ReactiveFormsModule,
        NgaModule,
        routing,
        DictionaryModule,
        AreaChooseModule,
        ModalModule.forRoot(),
        TypeaheadModule.forRoot(),
        BsDatepickerModule.forRoot(),
    ],
    exports: [],
    declarations: [
        WarningDetailComponent,
        WarningComponent,
        DetailComponent,
        CacheSettingComponent,
        StationViewComponent,
        AddStationComponent,
        ImgUploadComponent,
        AttentionEditComponent,
        ImgSettingComponent,
        SaveModalComponent,
        TemplateDetailComponent,
        ModalManageComponent,
        ChangeColorComponent,
        Account,
        BasicInfoComponent,
        ChangePassComponent,
        CustomSettingComponent,
        AddUserComponent,
        UserAreaModal,
        AddAreaComponent,
        AreaViewComponent,
        BookMarkComponent
    ],
    entryComponents: [
        WarningDetailComponent,
        DetailComponent,
        UserAreaModal,
        SaveModalComponent
    ],
    providers: [
        WarningService,
        BookMarkService,
        MetaService,
        WordService,
        MasterplateService,
        AddUserGuard,
        AddAreaGuard,
        AgmeDistService,
        ProdService,
        ConverterService,
        BsModalRef,
        BsModalService,
        FileUploadService
    ],
})
export class AccountModule {

}
