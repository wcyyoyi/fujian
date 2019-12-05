import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';

import { AuthGuard } from './guards/index';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
      { path: 'datas', loadChildren: 'app/pages/datas/datas.module#DatasModule', canActivate: [AuthGuard] },
      { path: 'editors', loadChildren: 'app/pages/editors/editors.module#EditorsModule', canActivate: [AuthGuard] },
      // { path: 'components', loadChildren: 'app/pages/components/components.module#ComponentsModule' },
      // { path: 'charts', loadChildren: 'app/pages/charts/charts.module#ChartsModule' },
      // { path: 'tables', loadChildren: 'app/pages/ui/ui.module#UiModule' },//ui
      { path: 'forms', loadChildren: 'app/pages/forms/forms.module#FormsModule', canActivate: [AuthGuard] },
      { path: 'analyses', loadChildren: 'app/pages/analyses/analyses.module#AnalysesModule', canActivate: [AuthGuard] },
      { path: 'product', loadChildren: 'app/pages/product/product.module#ProductModule', canActivate: [AuthGuard] },
      { path: 'account', loadChildren: 'app/pages/account/account.module#AccountModule', canActivate: [AuthGuard] },
      // { path: 'tables', loadChildren: 'app/pages/tables/tables.module#TablesModule' },
      // { path: 'maps', loadChildren: 'app/pages/maps/maps.module#MapsModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
