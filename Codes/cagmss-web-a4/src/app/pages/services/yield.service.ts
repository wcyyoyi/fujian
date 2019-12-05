import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { ApiService } from './api.service'

@Injectable()
export class YieldService extends ApiService {
    constructor(http: Http) {
        super(http);
    }

    getByFilter(year: number, cropName: string) {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();

        filter.append('vYear', year.toString());
        filter.append('c56001', cropName);

        options.search = filter;

        return this.http.get(this.data_url + '/yield/prvos/query', options)
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('YieldService an error occurred', error);
        return Promise.resolve(null);
    }
}