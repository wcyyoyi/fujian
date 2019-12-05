import { Routes, RouterModule } from '@angular/router';

import { Forms } from './forms.component';
import { DisasterComponent } from './disaster/disaster.component';
import { DisasterViewComponent } from './disasterview/disasterview.component';
import { AgmeComponent } from './agme/agme.component';
import { AgmeViewComponent } from './agmeView/agmeView.component';
import { ProductUpload } from './productUpload/productUpload.component';
import { AgmeCliComponent } from './agmecli/agmeCli';
const routes: Routes = [
  {
    path: '',
    component: Forms,
    children: [
      { path: '', redirectTo: 'disasterview', pathMatch: 'full' },
      { path: 'disaster', component: DisasterComponent },
      { path: 'disasterview', component: DisasterViewComponent },
      { path: 'agme', component: AgmeComponent },
      { path: 'agmeView', component: AgmeViewComponent },
      { path: 'agmeCli', component: AgmeCliComponent },
      { path: 'product', component: ProductUpload },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
