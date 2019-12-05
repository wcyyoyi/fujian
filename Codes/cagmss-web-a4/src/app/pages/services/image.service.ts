import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { User } from '../models/index';
import { ApiService } from './api.service'

@Injectable()
export class ImageService extends ApiService {

    constructor(http: Http) {
        super(http);
    }
    //获取类型枚举
    getAllType() {
        let url = this.data_url + '/meteometas/enum/type'
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
}