import { Routes, RouterModule } from '@angular/router';
import { AddUserGuard } from '../guards/addUser.guard';
import { AddAreaGuard } from '../guards/addArea.guard';
import { Account } from './account.component';
import { ImgSettingComponent } from './components/userSetting/imgSetting/imgSetting.component';
import { BasicInfoComponent } from './components/userSetting/basic/basicInfo.component';
import { ChangePassComponent } from './components/userSetting/changePassword/changePassword.component';
import { CustomSettingComponent } from './components/userSetting/customSetting/customSetting.component';
import { AddUserComponent } from './components/userSetting/addUser/addUser.component';
import { ChangeColorComponent } from './components/userSetting/changeColor/changeColor.component';
import { UserAreaModal } from './components/userSetting/addUser/areaChoose/area.modal.component';
import { AddAreaComponent } from './components/areaSetting/addArea/addArea.component';
import { AreaViewComponent } from './components/areaSetting/areaView/areaView.component';
import { ModalManageComponent } from './components/configSetting/modalManage/modalManage.component';
import { SaveModalComponent } from './components/configSetting/saveModal/saveModal.component';
import { TemplateDetailComponent } from './components/configSetting/template/template.component';
import { AttentionEditComponent } from './components/configSetting/attentionEdit/attentionEdit.component';
import { AddStationComponent } from './components/stationSetting/addStation/addStation.component';
import { StationViewComponent } from './components/stationSetting/stationView/stationView.component';
import { CacheSettingComponent } from './components/configSetting/cacheSetting/cacheSetting.component';
import { BookMarkComponent } from './components/configSetting/bookMark/bookMark.component';
import { WarningComponent } from './components/configSetting/warning/warning.component';
const routes: Routes = [
  {
    path: '',
    component: Account,
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: BasicInfoComponent },
      { path: 'change', component: ChangePassComponent },
      { path: 'customSetting', component: CustomSettingComponent },
      { path: 'changeColor', component: ChangeColorComponent },
      { path: 'adduser', component: AddUserComponent, canActivate: [AddUserGuard] },
      { path: 'addarea', component: AddAreaComponent, canActivate: [AddAreaGuard] },
      { path: 'areaview', component: AreaViewComponent, canActivate: [AddAreaGuard] },
      { path: 'addstation', component: AddStationComponent, canActivate: [AddUserGuard] },
      { path: 'stationview', component: StationViewComponent, canActivate: [AddUserGuard] },
      { path: 'modalmanage', component: ModalManageComponent },
      { path: 'temlateDetail', component: TemplateDetailComponent },
      { path: 'imgSetting', component: ImgSettingComponent },
      { path: 'attentionEdit', component: AttentionEditComponent },
      { path: 'cacheSetting', component: CacheSettingComponent },
      { path: 'bookMark', component: BookMarkComponent },
      { path: 'warning', component: WarningComponent },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
