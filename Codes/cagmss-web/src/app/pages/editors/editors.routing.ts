import { Routes, RouterModule } from '@angular/router';

import { Editors } from './editors.component';
import { Ckeditor } from './components/ckeditor/ckeditor.component';
import { MapViews } from './prod/mapViews';
import { PdfViews } from './prod/pdfViews';



// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Editors,
    children: [
      { path: '', redirectTo: 'ckeditor1/WCRM,MONT', pathMatch: 'full' },
      { path: 'ckeditor1/:data', component: Ckeditor },
      { path: 'ckeditor2/:data', component: Ckeditor },
      { path: 'ckeditor3/:data', component: Ckeditor },
      { path: 'ckeditor4/:data', component: Ckeditor },
      { path: 'ckeditor5/:data', component: Ckeditor },
      { path: 'ckeditor6/:data', component: Ckeditor },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
