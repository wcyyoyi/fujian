import { NgModule } from '@angular/core';
import { FieldSettingsComponent, FieldCheckboxComponent } from './fieldSettings.component';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FieldSettingModalComponent } from './fieldSettings.modal.component';


@NgModule({
    imports: [
        CommonModule,
        NgaModule,
        Ng2SmartTableModule
    ],
    exports: [
        FieldCheckboxComponent,
        FieldSettingsComponent,
        FieldSettingModalComponent
    ],
    declarations: [
        FieldCheckboxComponent,
        FieldSettingsComponent,
        FieldSettingModalComponent
    ],
    providers: [],
    entryComponents:[
        FieldSettingModalComponent
    ]
})
export class FieldSettingsModule { }
