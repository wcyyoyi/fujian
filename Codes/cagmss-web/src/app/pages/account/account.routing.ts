import { Routes, RouterModule } from '@angular/router';

import { Account } from './account.component';
import { BasicInfoComponent } from './basic/basicInfo.component';
import { ChangePassComponent } from './changePassword/changePassword.component';

const routes: Routes = [
  {
    path: '',
    component: Account,
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: BasicInfoComponent },
      { path: 'change', component: ChangePassComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
