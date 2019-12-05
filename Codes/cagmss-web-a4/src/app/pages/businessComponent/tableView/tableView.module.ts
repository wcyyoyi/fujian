import { NgModule } from '@angular/core';
import { TableViewerModalComponent } from './tableView.modal.component';
import { NgaModule } from '../../../theme/nga.module';
import { CommonModule } from '@angular/common';
import { ProdService } from '../../services/product.service';


@NgModule({
    imports: [CommonModule, NgaModule],
    exports: [],
    declarations: [TableViewerModalComponent],
    entryComponents: [TableViewerModalComponent],
    providers: [ProdService],
})
export class TableViewerModule { }
