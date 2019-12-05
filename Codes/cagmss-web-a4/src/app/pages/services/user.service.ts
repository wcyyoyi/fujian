import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams, RequestMethod, Request } from '@angular/http';

import { User } from '../models/index';
import { ApiService } from './api.service'
import { UserConfig } from '../models/userConfig/UserConfig';
import { Model } from '../models/userConfig/Model';

const key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

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
        return this.http.post(this.us_url + '/users/2', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put(this.us_url + '/users', user, this.jwt()).map((response: Response) => response.json());
    }

    changePass(id, pass) {
        return this.http.put(this.us_url + '/users/' + id + '/reset', pass, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        let d_options: RequestOptions = this.jwt();
        d_options.method = RequestMethod.Delete;
        return this.http.request(new Request({
            method: RequestMethod.Delete,
            url: this.us_url + '/users/' + id,
            headers: this.jwt().headers
        }))
    }
    getRoleLevel() {
        let url = this.us_url + '/roles/roleLevels';
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
    updateSetting(userConfig: UserConfig) {
        let url = this.us_url + '/settings?projectName=' + this.projectName;
        return this.http.put(url, userConfig, this.jwt()).map((response: Response) => response.text());
    }

    updateChildrenSetting(models: Array<Model>) {
        let url = this.us_url + '/settings/batch?projectName=' + this.projectName;
        return this.http.put(url, models, this.jwt()).map((response: Response) => response.text());
    }

    getUserSetting() {
        let url = this.us_url + '/settings?projectName=' + this.projectName;
        return this.http.get(url, this.jwt()).map((response: Response) => response.text());
    }
    getRoleByUsername(username: string) {
        let url = this.us_url + '/roles/username/' + username;
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }

    encode(code: string) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        do {
            chr1 = code.charCodeAt(i++);
            chr2 = code.charCodeAt(i++);
            chr3 = code.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + key.charAt(enc1) + key.charAt(enc2)
                + key.charAt(enc3) + key.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < code.length);

        return output;
    }
}