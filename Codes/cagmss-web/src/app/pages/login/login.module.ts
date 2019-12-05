import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { Login } from './login.component';
import { routing }       from './login.routing';
import { AreaService } from '../services';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing
  ],
  providers: [
    AreaService
],
  declarations: [
    Login
  ]
})
export class LoginModule {}
