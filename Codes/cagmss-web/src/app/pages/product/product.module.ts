import { NgModule } from '@angular/core';

import { Product } from './product.component';
import { routing } from './product.routing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { CarouselModule, TabsModule, ModalModule, AlertModule, PaginationModule } from 'ngx-bootstrap';
import { ProdService } from '../services/product.service';
import { HomePage } from './homePage/homePage.component';
import { Display } from './display/display.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ImgViewComponent } from './display/imgView/imgViewer.component';
import { WordViewComponent } from './display/wordView/wordView.component';
import { ExportService } from '../services/export.service';
import { WordService } from '../services/word.service';
import { BComponent } from './display/component/component';
import { AreaService } from '../services';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgaModule,
        routing,
        CarouselModule.forRoot(),
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        AlertModule.forRoot(),
        Ng2SmartTableModule,
    ],
    exports: [],
    declarations: [
        WordViewComponent,
        ImgViewComponent,
        Display,
        HomePage,
        Product,
        BComponent,
    ],
    providers: [
        ProdService,
        ExportService,
        WordService,
        AreaService
    ],
    entryComponents: [
        WordViewComponent,
        ImgViewComponent,
        BComponent
    ],
})
export class ProductModule { }
