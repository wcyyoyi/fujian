import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';

import { Pages } from './pages.component';
import { BaNavbarTop } from './baNavbarTop';

import { AlertService, AuthenticationService, UserService, ApiService } from './services/index';
import { AuthGuard } from './guards/index';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [CommonModule, NgaModule, routing],
  declarations: [Pages, BaNavbarTop],
  providers: [AuthGuard, AlertService, ApiService, AuthenticationService, UserService],
})
export class PagesModule {
}
