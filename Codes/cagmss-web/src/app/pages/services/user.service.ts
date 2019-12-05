import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../models/index';
import { ApiService } from './api.service'

@Injectable()
export class UserService extends ApiService {

    constructor(http: Http) {
        super(http);
    }

    getAll() {
        return this.http.get(this.us_url + '/users', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.us_url + '/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getByName(name: string) {
        return this.http.get(this.us_url + '/users/info?username=' + name, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post(this.us_url + '/users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put(this.us_url + '/users', user, this.jwt()).map((response: Response) => response.json());
    }

    changePass(id, pass) {
        return this.http.put(this.us_url + '/users/' + id + '/reset', pass, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(this.us_url + '/users/' + id, this.jwt()).map((response: Response) => response.json());
    }
}