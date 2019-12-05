import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { ApiService, UserService } from '../services';
import { User } from '../models';

@Injectable()
export class AddUserGuard implements CanActivate {

    constructor(private userService: UserService) { }

    canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        return this.userService.getRoleByUsername(this.userService.userName).toPromise().then(role => {
            if (role.id === 2) {
                alert('没有该权限！');
                return false;
            } else {
                return true;
            }
        });
    }
}