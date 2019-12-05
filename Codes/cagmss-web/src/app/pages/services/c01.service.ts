import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { User } from '../models/index';
import { ApiService } from './api.service'

@Injectable()
export class C01Service extends ApiService {

    //baseUrl: string = 'http://www.cagmss.com:8090';

    constructor(http: Http) {
        super(http);
    }

    getAll() {
        return this.http.get(this.data_url + '/agme/c01', this.jwt()).map((response: Response) => response.json());
    }

    getByFilter(stats: string, startDate: Date, endDate: Date) {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();

        filter.append('v01000', stats);
        filter.append('vstart', startDate.getTime().toString());
        filter.append('vend', endDate.getTime().toString());

        options.search = filter;

        return this.http.get(this.data_url + '/agme/c01/query', options).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.data_url + '/agme/c01/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post(this.data_url + '/agme/c01', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put(this.data_url + '/agme/c01/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(this.data_url + '/agme/c01/' + id, this.jwt()).map((response: Response) => response.json());
    }
}