import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './account.routing';
import { Account } from './account.component';
import { BasicInfoComponent } from './basic/basicInfo.component';
import { ChangePassComponent } from './changePassword/changePassword.component';

@NgModule({
    imports: [
        CommonModule,
        AngularFormsModule,
        ReactiveFormsModule,
        NgaModule,
        routing
    ],
    exports: [],
    declarations: [
        Account,
        BasicInfoComponent,
        ChangePassComponent
    ],
    providers: [],
})
export class AccountModule { 

}
