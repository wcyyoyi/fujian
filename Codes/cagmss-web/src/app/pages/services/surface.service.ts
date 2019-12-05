import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { DatePipe } from '@angular/common';

import { User } from '../models/index';
import { ApiService } from './api.service'

@Injectable()
export class SurfaceService extends ApiService {

    //baseUrl: string = 'http://www.cagmss.com:8090';
    private datePipe: DatePipe;

    constructor(http: Http) {
        super(http);

        this.datePipe = new DatePipe("en-US");
    }

    getAll() {
        return this.http.get(this.data_url + '/surf/days', this.jwt()).map((response: Response) => response.json());
    }

    getByFilter(stats: string, startDate: Date, endDate: Date) {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();

        filter.append('v01000', stats);
        filter.append('vdates1', startDate.getTime().toString());
        filter.append('vdatee1', endDate.getTime().toString());

        options.search = filter;

        return this.http.get(this.data_url + '/surf/days/query', options).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.data_url + '/surf/days/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post(this.data_url + '/surf/days', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put(this.data_url + '/surf/days/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(this.data_url + '/surf/days/' + id, this.jwt()).map((response: Response) => response.json());
    }

    statDays(statType: number, statEle: string, startDate: Date, endDate: Date) {
        let url = this.data_url + '/surf/days/stat/' + statType;
        let options: RequestOptions = this.jwt();
        let params: URLSearchParams = new URLSearchParams();

        let dateFormat = "yyyyMMdd000000";
        let sDateStr = this.datePipe.transform(startDate, dateFormat);
        let eDateStr = this.datePipe.transform(endDate, dateFormat);
        params.append('vdate', '[' + sDateStr + ',' + eDateStr + ']');

        params.append('velement', statEle);
        params.append('groupby', 'v01000');

        options.search = params;

        return this.http.get(url, options).map((response: Response) => response.json());
    }
}