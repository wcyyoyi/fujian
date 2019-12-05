import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { User } from '../models/index';
import { ApiService } from './api.service'

@Injectable()
export class ImageService extends ApiService {

    constructor(http: Http) {
        super(http);
    }

    getAll() {
        return this.http.get(this.data_url + '/prod/imgs', this.jwt()).map((response: Response) => response.json());
    }

    getByFilter(dataType: string, dataEle: string, dataFormat: string = 'png') {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();

        filter.append('makeCompany', this.makeCompany);
        filter.append('dataType', dataType);
        filter.append('dataEle', dataEle);
        filter.append('dataFormat', dataFormat);

        options.search = filter;

        return this.http.get(this.data_url + '/prod/imgs/query', options).map((response: Response) => response.json());
    }

    getById(name: string) {
        return this.http.get(this.data_url + '/prod/imgs/' + name, this.jwt()).map((response: Response) => response.json());
    }

    getUrl(name: string) {
        return this.data_url + '/prod/imgs/' + name + '?access_token=' + this.getToken().access_token;
    }

    getUrlByClass(format: string, type: string, name: string) {
        return this.data_url + '/prod/imgs/' + this.makeCompany +
            '/' + format + '/' + type + '/' + name +
            '?access_token=' + this.getToken().access_token;
    }

    create(user: User) {
        return this.http.post(this.data_url + '/prod/imgs', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put(this.data_url + '/prod/imgs/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(name: string) {
        return this.http.delete(this.data_url + '/prod/imgs/' + name, this.jwt()).map((response: Response) => response.json());
    }
}