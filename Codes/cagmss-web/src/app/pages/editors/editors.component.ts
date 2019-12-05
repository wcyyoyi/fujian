import { Component } from '@angular/core';
import { Router, Routes } from '@angular/router';

import { BaMenuService } from '../../theme';
import { EDITORS_MENU } from './editors.menu';

@Component({
  selector: 'editors',
  providers: [BaMenuService],
  styleUrls: ['./editors.scss'],
  template: `<div class="al-main2">
              <div class="al-sidebar-left">
              <ba-sidebar></ba-sidebar></div>
              <div class="container"><router-outlet></router-outlet></div>
            </div>`
})

export class Editors {
  // private _menuService: BaMenuService;

  constructor(private _menuService: BaMenuService) {
    // this._menuService = new BaMenuService(this._router);
  }

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>EDITORS_MENU);
  }
}
