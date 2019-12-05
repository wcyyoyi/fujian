import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { ApiService, UserService } from '../services';
import { User } from '../models';

@Injectable()
export class AddAreaGuard implements CanActivate {

    constructor(private userService: UserService) { }

    canActivate(route: ActivatedRouteSnapshot) {
        let level = JSON.parse(localStorage.getItem("activeUser"))["area"]["level"];
        if (level == 3) {
            alert('没有该权限！');
            return false;
        } else {
            return true;
        }
    }
}