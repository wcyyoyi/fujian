import { NgModule } from '@angular/core';

import { ImgViewerModalComponent } from './imgViewer.modal.component';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../../theme/nga.module';
import { ImgViewerComponent } from './imgViewer.component';

@NgModule({
    imports: [CommonModule, NgaModule],
    exports: [],
    declarations: [
        ImgViewerComponent,
        ImgViewerModalComponent
    ],
    entryComponents: [
        ImgViewerComponent,
        ImgViewerModalComponent
    ],
    providers: [],
})
export class ImgViewerModule { }
