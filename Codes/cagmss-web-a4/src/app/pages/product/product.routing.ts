import { Routes, RouterModule } from '@angular/router';
import { Product } from './product.component';
import { HomePageComponent } from './homePage/homePage.component';
import { Display } from './display/display.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Product,
    children: [
      // { path: '', redirectTo: 'homePage/:data', pathMatch: 'prefix' },
      { path: 'homePage/:data/display/:data', component: Display },
      { path: 'homePage/:data', component: HomePageComponent },

    ]
  }
];

export const routing = RouterModule.forChild(routes);
