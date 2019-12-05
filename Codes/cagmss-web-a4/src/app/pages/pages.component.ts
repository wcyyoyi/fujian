import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';
import { UserConfig } from './models/userConfig/userConfig';
import { ApiService } from './services';
// <ba-sidebar></ba-sidebar>
// <ba-content-top></ba-content-top>
// class="al-content"
@Component({
  selector: 'pages',
  providers: [BaMenuService],
  template: `
    <ba-page-top name="{{username}}"></ba-page-top>
    <ba-navbar-top></ba-navbar-top>
    <router-outlet></router-outlet>
    <ba-back-top position="200"></ba-back-top>
    `
})
export class Pages {

  public username: string = '';

  constructor(private _menuService: BaMenuService, private apiService: ApiService) {

  }

  ngOnInit() {
    let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
    let body = document.getElementsByTagName("body")[0];
    body.className = "body-level" + level;
    this.username = JSON.parse(localStorage.getItem("activeUser"))["name"];
    // let userConfig: UserConfig = JSON.parse(localStorage.getItem('activeUser'));
    // this.username = userConfig.name;
    // let menus = new Array();
    // userConfig.models.forEach(model => {
    //   PAGES_MENU[0].children.forEach(menu => {
    //     if (menu.path === model.code) {
    //       menu.data.menu.hidden = false;
    //       menus.push(menu);
    //     }
    //   });
    // });
    // PAGES_MENU[0].children = menus;

    if (!PAGES_MENU[0].children.find(c => c.path == 'acrs')) {
      PAGES_MENU[0].children.push({
        path: 'acrs',
        data: {
          menu: {
            title: '区划成果',
            icon: 'ion-grid',
            selected: false,
            expanded: false,
            hidden: false,
            order: 600,
            url: this.apiService.acrsUrl,
            target: '_blank'
          }
        },
      })
    }
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
  }
}
