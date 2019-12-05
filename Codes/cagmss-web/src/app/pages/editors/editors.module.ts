import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgaModule } from '../../theme/nga.module';

import { routing } from './editors.routing';
import { Editors } from './editors.component';
import { Ckeditor } from './components/ckeditor/ckeditor.component';
import { WordService } from '../services/word.service';
import { MapsModule } from '../maps/maps.module';
import { TabsModule } from 'ngx-bootstrap';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { ImageService } from '../services';


// import { SelectInputs } from '../forms/components/inputs/components/selectInputs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    MapsModule,
    CKEditorModule,
    routing,
    TabsModule.forRoot()
  ],
  declarations: [
    Editors,
    Ckeditor,
    // SelectInputs
  ],
  exports: [
  ],
  providers: [
    WordService,
    ImageService,
  ]
})
export class EditorsModule {
}
