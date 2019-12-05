import { NgModule } from '@angular/core';
import { YzNgxStationModule } from 'yz-ngx-base/src/yz-ngx-station';
import { YzNgxToastyModule } from 'yz-ngx-base/src/yz-ngx-toasty';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../../theme/nga.module';
import { StationSettingsModal } from './stationSettings.modal.component';
import { DefinitionService } from '../../services/definition.service';
@NgModule({
    imports: [
        CommonModule,
        NgaModule,
        YzNgxStationModule.forRoot(),
        YzNgxToastyModule.forRoot()
    ],
    exports: [
        StationSettingsModal
    ],
    declarations: [
        StationSettingsModal
    ],
    providers: [
        DefinitionService
    ],
    entryComponents:[
        StationSettingsModal
    ]
})
export class StationChooseModule { }
