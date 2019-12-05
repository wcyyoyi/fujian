import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';

import { BaMenuService } from '../../theme';
import { DATAS_MENU } from './datas.menu';

@Component({
    selector: 'datas',
    providers: [BaMenuService],
    styleUrls: ['./datas.scss'],
    template: `<div class="al-main2">
              <div class="al-sidebar-left">
              <ba-sidebar></ba-sidebar></div>
              <div class="container mw-100"><router-outlet></router-outlet></div>
            </div>`
})

export class Datas implements OnInit {
    constructor(private _menuService: BaMenuService) { 

    }

    ngOnInit() { 
        this._menuService.updateMenuByRoutes(<Routes>DATAS_MENU);
    }
}