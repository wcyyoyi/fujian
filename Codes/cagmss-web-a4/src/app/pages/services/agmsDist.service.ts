import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { ApiService } from './api.service';
import { AgmeDist } from '../models/agmeDist';

@Injectable()
export class AgmeDistService extends ApiService {

    constructor(http: Http) {
        super(http);
    }

    getByFilter(cUsername: string, cAreaCode: string, cDistCode: string, vdate: string) {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();

        filter.append('cUsername', cUsername);
        filter.append('cAreaCode', cAreaCode);
        filter.append('cDistCode', cDistCode);
        filter.append('vdate', vdate);

        options.search = filter;

        return this.http.get(this.data_url + '/dist/ele/query', options).map((response: Response) => response.json());
    }

    create(agmeDist: AgmeDist) {
        return this.http.post(this.data_url + '/dist/ele',
            agmeDist, this.jwt()).map((response: Response) => response.json());
    }

    update(agmeDist: AgmeDist) {
        return this.http.put(this.data_url + '/dist/ele',
            agmeDist, this.jwt()).map((response: Response) => response.json());
    }
}