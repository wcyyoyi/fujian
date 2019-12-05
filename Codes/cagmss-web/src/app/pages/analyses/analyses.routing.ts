import { Routes, RouterModule } from '@angular/router';

import { Analyses } from './analyses.component';
import { StatTables } from './components/statTables';

const routes: Routes = [
  {
    path: '',
    component: Analyses,
    children: [
      // { path: '', redirectTo: 'ckeditor', pathMatch: 'full' },
      { path: ':field/:type', component: StatTables }

    ]
  }
];

export const routing = RouterModule.forChild(routes);
