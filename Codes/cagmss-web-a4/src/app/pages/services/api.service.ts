import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Token } from '../models/index';
import { UserConfig } from '../models/userConfig/UserConfig';
import { environment } from 'environments/environment';

@Injectable()
export class ApiService {
    protected us_url: string;
    protected headers = new Headers();
    protected metas_url: string;

    protected _userName: string = '';
    protected _areaCode: string = '350000';
    protected _level: number = 1;
    protected _makeCompany: string = 'BEFZ';
    protected _data_url: string;
    protected _pro_url: string;
    protected mapUrl: string;
    protected _map_url: string = 'http://www.cagmss.com:81/styles/outdoors/style.json';
    protected _project_name: string = "YUN-SERVICES-METEO";
    protected _acrs_url: string;

    get acrsUrl() {
        return this._acrs_url;
    }
    get projectName() {
        return this._project_name;
    }

    get makeCompany() {
        let userConfig: UserConfig = JSON.parse(localStorage.getItem('activeUser'));
        if (userConfig) {
            this._makeCompany = userConfig.area.pCode;
        }

        return this._makeCompany;
    }

    get data_url() {
        // let userConfig: UserConfig = JSON.parse(localStorage.getItem('activeUser'));
        // if (userConfig) {
        //     this._data_url = userConfig.area.serviceUrl;
        //     // this._data_url = 'http://192.168.1.147:3699';
        //     // this._data_url = 'http://192.168.1.253:9002/ysg/meteo';
        // }

        return this._data_url;
    }

    getMap_url(index?: number) {
        let userConfig: UserConfig = JSON.parse(localStorage.getItem('activeUser'));
        if (userConfig) {
            this._map_url = userConfig.area.mapUrl.split(",")[index ? index : 0];
        }
        // this._map_url = 'http://www.cagmss.com:81/styles/outdoors/style.json';
        // this._map_url = 'http://192.168.1.253:8081/styles/outdoors/style.json';
        // this._map_url = 'http://192.168.99.100:8081/styles/outdoors/style.json';

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

    get level() {
        let userConfig: UserConfig = JSON.parse(localStorage.getItem('activeUser'));
        if (userConfig) {
            this._level = userConfig.area.level;
        }

        return this._level;
    }

    get token() {
        let token: Token = JSON.parse(localStorage.getItem('token'));
        return token;
    }
    get pro_url() {
        return this._pro_url;
    }
    get getMapUrl() {
        return this.mapUrl;
    }
    constructor(protected http: Http) {
        this.us_url = environment.webSysConf.us_url;
        this.metas_url = environment.webSysConf.metas_url;
        this._pro_url = environment.webSysConf.pro_url;
        this._pro_url = environment.webSysConf.pro_url;
        this._data_url = environment.webSysConf.data_url;
        this.mapUrl = environment.webSysConf.map_url;
        this._acrs_url = environment.webSysConf.acrs_url;
    }

    public getUserConfig(username: string = ''): Promise<UserConfig> {
        let userConfig: UserConfig = JSON.parse(localStorage.getItem('activeUser'));

        if (userConfig) {
            return Promise.resolve(userConfig);
        }
        else {
            let url = this.us_url + '/settings?projectName=' + this.projectName;
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

    public getToken() {
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

    public getAssetsFile(filePath: string) {
        let url = this.getWebUrl() + '/assets/' + filePath;
        return this.http.get(url).map((response: Response) => response.json());
    }

    protected destroy() {
        // remove user from local storage to log user out
        localStorage.removeItem('activeUser');
        localStorage.removeItem('token');
    }

    private async refreshToken() {
        let url = this.us_url + '/oauth/token?grant_type=refresh_token&refresh_token=' + this.getToken().refresh_token;

        this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.set('Authorization', 'Basic ' + 'bXktdHJ1c3RlZC1jbGllbnQ6c2VjcmV0');
        let options = new RequestOptions({ headers: this.headers });
        // console.log("refresh1");
        let rep = await this.http.post(url, null, options).toPromise();
        let myToken: Token = rep.json();

        localStorage.removeItem('token');
        this.setToken(myToken);

        return myToken;
    }
}
