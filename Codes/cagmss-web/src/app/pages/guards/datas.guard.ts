import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';

import { DataState } from '../datas/datas.state';

@Injectable()
export class DatasGuard implements CanActivate {

    constructor(private router: Router, private state: DataState) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let tabName = route.params['name'];
        let settings = this.state[tabName];

        if (settings)
            return true;
        
        this.router.navigate(route.parent.url);
        return false;
    }
}