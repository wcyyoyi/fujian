import { NgModule } from '@angular/core';
import { PdfViewerModalComponent } from './pdfViewer.modal.component';
import { NgaModule } from '../../../theme/nga.module';
import { CommonModule } from '@angular/common';
import { ProdService } from '../../services/product.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
    imports: [CommonModule, NgaModule,PdfViewerModule],
    exports: [],
    declarations: [PdfViewerModalComponent],
    entryComponents: [PdfViewerModalComponent],
    providers: [ProdService],
})
export class PdfViewModule { }
