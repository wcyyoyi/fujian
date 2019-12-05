import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { ApiService } from '../services'
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
    constructor(private _menuService: BaMenuService, private apiService: ApiService) {

    }
    ngOnInit() {
        this.apiService.getUserConfig().then(data => {
            if (data["name"] != "superadmin") {
                for (let i = 0; i < ACCOUNT_MENU[0]["children"].length; i++) {
                    if (ACCOUNT_MENU[0]["children"][i]["data"]["menu"]["title"] == "用户管理") {
                        ACCOUNT_MENU[0]["children"][i]["data"]["menu"]["hidden"] = true;
                    }
                }
            } else {
                for (let i = 0; i < ACCOUNT_MENU[0]["children"].length; i++) {
                    if (ACCOUNT_MENU[0]["children"][i]["data"]["menu"]["title"] == "用户管理") {
                        ACCOUNT_MENU[0]["children"][i]["data"]["menu"]["hidden"] = false;
                    }
                }
            }
            this._menuService.updateMenuByRoutes(<Routes>ACCOUNT_MENU);
        })
    }
}