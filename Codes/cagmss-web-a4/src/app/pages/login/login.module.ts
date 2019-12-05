import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { Login } from './login.component';
import { routing }       from './login.routing';
import { AreaService, CropDictService, StationService } from '../services';
import { DictionaryModule } from '../utils/Dictionary.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    DictionaryModule
  ],
  providers: [
    AreaService,
],
  declarations: [
    Login
  ]
})
export class LoginModule {}
