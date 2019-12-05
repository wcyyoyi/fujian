import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from './components/setting/setting.component';
import { Analyses } from './analyses.component';

const routes: Routes = [
  {
    path: '',
    component: Analyses,
    children: [
      // { path: '', redirectTo: 'ckeditor', pathMatch: 'full' },
      { path: ':field/:type', component: SettingComponent }

    ]
  }
];

export const routing = RouterModule.forChild(routes);
