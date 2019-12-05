import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { ApiService } from '../services';

@Injectable()
export class EditorsGuard implements CanActivate {

    constructor(private apiService: ApiService) { }

    canActivate(route: ActivatedRouteSnapshot) {
        let type: string = route.params['data'].split(',');

        let result = true;

        switch (this.apiService.level) {
            case 1:
                if (type[1] === 'WEEK') result = false;
                break;
            case 2:
                if (type[1] === 'MONT'||type[1] === 'TEND') result = false;
                break;
            case 3:
                if (type[1] === 'MONT'||type[1] === 'TEND') result = false;
                break;
        }

        if(!result){
            alert('暂无此模版！');
        }
        return result;
    }
}