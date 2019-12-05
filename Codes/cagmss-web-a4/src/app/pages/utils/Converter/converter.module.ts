import { NgModule } from '@angular/core';
import { DictionaryModule } from '../Dictionary.module';
import { ConverterService } from './converter.service';


@NgModule({
    imports: [
        DictionaryModule
    ],
    exports: [],
    declarations: [],
    providers: [
        ConverterService,
    ],
})
export class ConverterModule { }
