import { Component, OnInit } from '@angular/core';
import { BaMenuService } from '../../theme';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { ProdService } from '../services/product.service';
import { UserConfig } from '../models/userConfig/UserConfig';
import { AreaService } from '../services';
import { PRODUCT_MENU } from './product.menu';

@Component({
    selector: 'product',
    providers: [BaMenuService],
    template: `<div class="al-main2">
              <div class="al-sidebar-left">
              <ba-sidebar></ba-sidebar></div>
              <div class="container"><router-outlet></router-outlet></div>
            </div>`
})

export class Product implements OnInit {
    constructor(private _menuService: BaMenuService,
        private _productService: ProdService,
        private _areaService: AreaService,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit() {
        if (PRODUCT_MENU.length < 1) {
            this.createMenu();
        } else {
            this._menuService.updateMenuByRoutes(<Routes>PRODUCT_MENU);
        }

        this.router.navigate(['homePage', this._areaService.makeCompany], { relativeTo: this.route });
    }

    createMenu() {
        this._productService.getUserConfig('').then((userConfig: UserConfig) => {
            let mainMenu = {
                path: 'pages',
                children: []
            };


            let counMainMenu = {
                path: 'product',
                data: {
                    menu: {
                        title: '县级',
                        icon: 'ion-grid',
                        selected: false,
                        expanded: false,
                        order: 100
                    }
                },
                children: []
            };

            let cityMainMenu = {
                path: 'product',
                data: {
                    menu: {
                        title: '市级',
                        icon: 'ion-grid',
                        selected: false,
                        expanded: false,
                        order: 100
                    }
                },
                children: []
            };

            let provMainMenu = {
                path: 'product',
                data: {
                    menu: {
                        title: '省级',
                        icon: 'ion-grid',
                        selected: false,
                        expanded: true,
                        order: 100
                    }
                },
                children: [
                    {
                        path: 'homePage/' + userConfig.area.pCode,
                        data: {
                            menu: {
                                title: '概况',
                                icon: 'ion-edit',
                                selected: true,
                                expanded: false,
                                order: 100
                            }
                        }
                    }
                ]
            };
            let code = Number(userConfig.area.code) / 10000;
            this._areaService.getByFilter(code, 2).then(cityList => {
                this._areaService.getByFilter(code, 3).then(counList => {
                    cityList.forEach(city => {
                        let cityMenu = {
                            path: 'homePage/' + city.cPCode,
                            data: {
                                menu: {
                                    title: city.cName,
                                    icon: 'ion-edit',
                                    selected: false,
                                    expanded: false,
                                    order: 101
                                }
                            }
                        };

                        let counCityMenu = {
                            path: 'product',
                            data: {
                                menu: {
                                    title: city.cName,
                                    icon: 'ion-grid',
                                    selected: false,
                                    expanded: false,
                                    order: 100
                                }
                            },
                            children: []
                        };
                        cityMainMenu.children.push(cityMenu);
                        counList.forEach(coun => {
                            if (Math.floor(Number(coun.cCode) / 100) === Math.floor(Number(city.cCode) / 100)) {
                                let counMenu = {
                                    path: 'homePage/' + coun.cPCode,
                                    data: {
                                        menu: {
                                            title: coun.cName,
                                            icon: 'ion-edit',
                                            selected: false,
                                            expanded: false,
                                            order: 101
                                        }
                                    }
                                };
                                counCityMenu.children.push(counMenu);
                            }
                        });
                        counMainMenu.children.push(counCityMenu);
                    });
                    mainMenu.children.push(provMainMenu);
                    mainMenu.children.push(cityMainMenu);
                    mainMenu.children.push(counMainMenu);
                    PRODUCT_MENU.push(mainMenu);

                    let prodRoutes: Routes = <Routes>PRODUCT_MENU;
                    this._menuService.updateMenuByRoutes(prodRoutes);
                });
            });
        });
    }
}
