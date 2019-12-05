import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { BaMenuService } from '../../theme/services';
import { GlobalState } from '../../global.state';

import 'style-loader!./baNavbarTop.scss';
import { ApiService } from '../services';

@Component({
    selector: 'ba-navbar-top',
    // styleUrls: ['./baNavbarTop.scss'],
    templateUrl: 'baNavbarTop.component.html'
})

export class BaNavbarTop {
    @Input() sidebarCollapsed: boolean = false;
    @Input() menuHeight: number;

    @Output() expandMenu = new EventEmitter<any>();

    public menuItems: any[];
    protected _menuItemsSub: Subscription;
    protected _onRouteChange: Subscription;
    constructor(private _router: Router, private _service: BaMenuService, private _state: GlobalState,
        private apiService: ApiService) {
    }

    public ngOnInit(): void {
        this._onRouteChange = this._router.events.subscribe((event) => {

            if (event instanceof NavigationEnd) {
                if (this.menuItems) {
                    this.selectMenuAndNotify();
                } else {
                    // on page load we have to wait as event is fired before menu elements are prepared
                    setTimeout(() => this.selectMenuAndNotify());
                }
            }
        });

        this._menuItemsSub = this._service.menuItems.subscribe(this.updateMenu.bind(this));
    }

    public updateMenu(newMenuItems) {
        this.menuItems = newMenuItems;
        this.selectMenuAndNotify();
    }

    public selectMenuAndNotify(): void {
        if (this.menuItems) {
            this.menuItems = this._service.selectMenuItem(this.menuItems);
            this._state.notifyDataChanged('menu.activeLink', this._service.getCurrentItem());
        }
    }

    public ngOnDestroy(): void {
        this._onRouteChange.unsubscribe();
        this._menuItemsSub.unsubscribe();
    }
}