import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';

import { BaMenuService } from '../../theme';
import { ACCOUNT_MENU } from './account.menu';

@Component({
    selector: 'account',
    providers: [BaMenuService],
    styleUrls: ['./account.scss'],
    template: `<div class="al-main2">
              <div class="al-sidebar-left">
              <ba-sidebar></ba-sidebar></div>
              <div class="container"><router-outlet></router-outlet></div>
            </div>`
})

export class Account implements OnInit {
    constructor(private _menuService: BaMenuService) { 

    }

    ngOnInit() { 
        this._menuService.updateMenuByRoutes(<Routes>ACCOUNT_MENU);
    }
}