import { Component } from '@angular/core';
import { Router, Routes, ActivatedRoute } from '@angular/router';

import { BaMenuService } from '../../theme';
import { EDITORS_MENU } from './editors.menu';
import { ApiService } from '../services';

@Component({
  selector: 'editors',
  providers: [BaMenuService],
  styleUrls: ['./editors.scss'],
  template: `<div class="al-main2">
              <div class="al-sidebar-left">
              <ba-sidebar></ba-sidebar></div>
              <div class="container mw-100"><router-outlet></router-outlet></div>
            </div>`
})

export class Editors {
  // private _menuService: BaMenuService;

  constructor(
    private _menuService: BaMenuService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
  ) {
    // this._menuService = new BaMenuService(this._router);
  }

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>EDITORS_MENU);
    switch (this.apiService.level) {
      case 1:
        this.router.navigate(['ckeditor', 'WCRM,MONT'], { relativeTo: this.route });
        break;
      case 2:
        this.router.navigate(['ckeditor', 'WCRM,WEEK'], { relativeTo: this.route });
        break;
      case 3:
        this.router.navigate(['ckeditor', 'WCRM,WEEK'], { relativeTo: this.route });
        break;

      default:
        break;
    }
  }
}