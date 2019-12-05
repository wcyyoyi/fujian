import { Routes, RouterModule } from '@angular/router';
import { QualityComponent } from './quality.component';

const routes: Routes = [
  {
    path: '',
    component: QualityComponent,
    children: [

    ]
  }
];

export const routing = RouterModule.forChild(routes);
