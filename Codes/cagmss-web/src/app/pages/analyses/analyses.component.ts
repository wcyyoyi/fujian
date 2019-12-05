import { Component, OnInit } from '@angular/core';
import { Router, Routes, ActivatedRoute } from '@angular/router';

import { BaMenuService } from '../../theme';
import { ANALS_MENU } from './analyses.menu';

@Component({
    selector: 'analyses',
    providers: [BaMenuService],
    styleUrls: ['./analyses.scss'],
    template: `<div class="al-main2">
              <div class="al-sidebar-left"><ba-sidebar></ba-sidebar></div>
              <div class="container"><router-outlet></router-outlet></div>
            </div>`
})

export class Analyses implements OnInit {
    constructor(private _menuService: BaMenuService,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
        this._menuService.updateMenuByRoutes(<Routes>ANALS_MENU);
        this.router.navigate(['./', 'v12052:[300,]', '1'], { relativeTo: this.route });
    }
}