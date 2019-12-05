import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';

import { Pages } from './pages.component';
import { BaNavbarTop } from './baNavbarTop';

import { AlertService, AuthenticationService, UserService, ApiService } from './services';
import { AuthGuard } from './guards';
import { ModalModule } from 'ngx-bootstrap';
import { HttpInterceptorService } from './interfaces/HttpInterceptorService';
import { XHRBackend, RequestOptions, Http } from '@angular/http';

export function interceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions){
  let service = new HttpInterceptorService(xhrBackend, requestOptions);
  return service;
}

@NgModule({
  imports: [
    CommonModule,
     NgaModule, 
     routing,
     ModalModule.forRoot(),
    ],
  declarations: [Pages, BaNavbarTop],
  providers: [AuthGuard, 
    AlertService, 
    ApiService, 
    AuthenticationService, 
    UserService,
    HttpInterceptorService,
    {
      provide: Http,
      useFactory: interceptorFactory,
      deps: [XHRBackend, RequestOptions]
    }
  ],
})
export class PagesModule {
}
