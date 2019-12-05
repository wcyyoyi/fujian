import { Routes, RouterModule } from '@angular/router';

import { Datas } from './datas.component';
import { SmartTables, IndexTable, CropTable } from './components/smartTables';
import { IndexEditor } from './components/editors/indexEditor.component';

import { DatasGuard } from '../guards';

const routes: Routes = [
  {
    path: '',
    component: Datas,
    children: [
      { path: '', redirectTo: 'index/viewer', pathMatch: 'full' },
      { path: 'view/:name', component: SmartTables, canActivate: [DatasGuard] },
      { path: 'editor/:name', component: IndexEditor },
      { path: 'index/:name', component: IndexTable },
      { path: 'meta/:name', component: CropTable },
      // { path: 'asmm', component: SmartTables },
      // { path: 'ckeditor3', component: Ckeditor }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
