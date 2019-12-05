import { NgModule } from '@angular/core';
import { DictionaryService } from './Dictionary.service';
import { CropDictService, StationService, AreaService } from '../services';


@NgModule({
    providers: [
        DictionaryService,
        CropDictService,
        StationService,
        AreaService
    ],
})
export class DictionaryModule { }
