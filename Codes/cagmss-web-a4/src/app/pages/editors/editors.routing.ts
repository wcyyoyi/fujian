import { Routes, RouterModule } from '@angular/router';

import { Editors } from './editors.component';
import { Ckeditor } from './components/ckeditor/ckeditor.component';
import { GridImage } from './components/gridImage';
import { EditorsGuard } from '../guards/editors.guard';
// import { PdfViews } from './prod/pdfViews';



// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Editors,
    children: [
      // { path: '', redirectTo: 'ckeditor/WCRM,MONT', pathMatch: 'full' },
      { path: 'ckeditor/:data', component: Ckeditor, canActivate: [EditorsGuard]},
      { path: 'images', component: GridImage },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
