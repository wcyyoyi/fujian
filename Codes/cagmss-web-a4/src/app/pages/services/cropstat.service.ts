import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { ApiService } from './api.service';
import { AreaInfo } from '../models';

@Injectable()
export class CropStatService extends ApiService {
    private _cropStat: Array<any>;

    get cropStat() {
        if (this._cropStat && this._cropStat.length > 0) {
            return Promise.resolve(this._cropStat);
        }
        else {
            return this.getAll().toPromise();
        }
    }

    constructor(http: Http) {
        super(http);
    }

    getAll() {
        return this.http.get(this.data_url + '/mang/cropstat', this.jwt())
            .map((response: Response) => response.json());
    }

}
