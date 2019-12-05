import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { ApiService } from './api.service'
import { UserConfig } from '../models/userConfig/userConfig';
import { Token } from '../models';
import { DictionaryService } from '../utils/Dictionary.service';

@Injectable()
export class AuthenticationService extends ApiService {
    //baseUrl: string = 'http://www.cagmss.com:8089';
    //headers = new Headers();

    constructor(http: Http) {
        super(http);
    }

    createAuthorizationHeader(headers: Headers) {
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        headers.set('Authorization', 'Basic ' + 'eXotc2VydmljZS1jbGllbnQ6YWdtczEyMzQ=');
    }

    public login(username: string, password: string) {
        let url = this.us_url + '/oauth/token?grant_type=password&username=' + username;
        url = url + '&password=' + password;

        this.createAuthorizationHeader(this.headers);
        let options = new RequestOptions({ headers: this.headers });

        return this.http.post(url, null, options)
            .toPromise()
            .then((response: Response) => {
                let myToken: Token = response.json();
                this.setToken(myToken);
                return myToken;
            });
    }

    public logout() {
        this.destroy();
    }
}