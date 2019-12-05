import { NgModule } from '@angular/core';
import { WordViewerModalComponent } from './wordViewer.modal.component';
import { NgaModule } from '../../../theme/nga.module';
import { CommonModule } from '@angular/common';
import { ProdService } from '../../services/product.service';


@NgModule({
    imports: [CommonModule, NgaModule],
    exports: [],
    declarations: [WordViewerModalComponent],
    entryComponents: [WordViewerModalComponent],
    providers: [ProdService],
})
export class WordViewerModule { }
