import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';

import { BaMenuService } from '../../theme';
import { FORMS_MENU } from './forms.menu';

@Component({
    selector: 'forms',
    providers: [BaMenuService],
    styleUrls: ['./forms.scss'],
    template: `<div class="al-main2">
              <div class="al-sidebar-left">
              <ba-sidebar></ba-sidebar></div>
              <div class="container"><router-outlet></router-outlet></div>
            </div>`
})

export class Forms implements OnInit {
    constructor(private _menuService: BaMenuService) { 

    }

    ngOnInit() { 
        this._menuService.updateMenuByRoutes(<Routes>FORMS_MENU);
    }
}