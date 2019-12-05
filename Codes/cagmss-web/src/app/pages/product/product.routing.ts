import { Routes, RouterModule } from '@angular/router';
import { Product } from './product.component';
import { HomePage } from './homePage/homePage.component';
import { Display } from './display/display.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Product,
    children: [
      // { path: '', redirectTo: 'homePage/:data', pathMatch: 'prefix' },
      { path: 'homePage/:data/display/:data', component: Display },
      { path: 'homePage/:data', component: HomePage },

    ]
  }
];

export const routing = RouterModule.forChild(routes);
