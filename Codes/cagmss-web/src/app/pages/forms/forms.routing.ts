import { Routes, RouterModule } from '@angular/router';

import { Forms } from './forms.component';
import { DisasterComponent } from './disaster/disaster.component';
import { DisasterViewComponent } from './disasterview/disasterview.component';

const routes: Routes = [
  {
    path: '',
    component: Forms,
    children: [
      { path: '', redirectTo: 'disaster', pathMatch: 'full' },
      { path: 'disaster', component: DisasterComponent },
      { path: 'disasterview', component: DisasterViewComponent },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
