import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { User, Token } from '../models/index';
import { UserConfig } from '../models/userConfig/UserConfig';

@Injectable()
export class ApiService {
    protected us_url: string = 'http://192.168.1.147:8089';
    protected headers = new Headers();

    protected _userName: string = '';
    protected _areaCode: string = '350000';
    protected _makeCompany: string = 'BEFZ';
    protected _data_url: string = 'http://192.168.1.109:8090/api';
    protected _map_url: string = 'http://www.cagmss.com:81/styles/outdoors/style.json';

    get makeCompany() {
        let userConfig: UserConfig = JSON.parse(localStorage.getItem('activeUser'));
        if (userConfig) {
            this._makeCompany = userConfig.area.pCode;
        }

        return this._makeCompany;
    }

    get data_url() {
        let userConfig: UserConfig = JSON.parse(localStorage.getItem('activeUser'));
        if (userConfig) {
            this._data_url = userConfig.area.serviceUrl;
        }

        return this._data_url;
    }

    get map_url() {
        let userConfig: UserConfig = JSON.parse(localStorage.getItem('activeUser'));
        if (userConfig) {
            this._map_url = userConfig.area.mapUrl;
        }

        return this._map_url;
    }

    get userName() {
        let userConfig: UserConfig = JSON.parse(localStorage.getItem('activeUser'));
        if (userConfig) {
            this._userName = userConfig.name;
        }

        return this._userName;
    }

    get areaCode() {
        let userConfig: UserConfig = JSON.parse(localStorage.getItem('activeUser'));
        if (userConfig) {
            this._areaCode = userConfig.area.code;
        }

        return this._areaCode;
    }

    get token(){
        let token: Token = JSON.parse(localStorage.getItem('token'));
        return token;
    }

    constructor(protected http: Http) { }

    public getUserConfig(username: string = ''): Promise<UserConfig> {
        let userConfig: UserConfig = JSON.parse(localStorage.getItem('activeUser'));

        if (userConfig) {
            return Promise.resolve(userConfig);
        }
        else {
            let url = this.us_url + '/users/' + username + '/usersetting';
            return this.http.get(url, this.jwt())
                .toPromise()
                .then((response: Response) => {
                    userConfig = response.json();
                    localStorage.setItem('activeUser', JSON.stringify(userConfig));

                    return userConfig;
                });
        }
    }

    protected jwt() {
        // create authorization header with jwt token
        let token: Token = JSON.parse(localStorage.getItem('token'));

        if (token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + token.access_token });
            return new RequestOptions({ headers: headers });
        }
    }

    protected getToken() {
        let token: Token = JSON.parse(localStorage.getItem('token'));
        return token;
    }

    protected setToken(token: Token) {
        localStorage.setItem('token', JSON.stringify(token));
    }

    protected getWebUrl() {
        let host = window.location.hostname || '127.0.0.1';
        let port = window.location.port || 81;

        return 'http://' + host + ':' + port;
    }

    protected destroy() {
        // remove user from local storage to log user out
        localStorage.removeItem('activeUser');
        localStorage.removeItem('token');
    }
}
