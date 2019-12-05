import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams, RequestMethod, Request } from '@angular/http';
import { DatePipe } from '@angular/common';
import { User } from '../models/index';
import { ApiService } from './api.service'

@Injectable()
export class CliService extends ApiService {
    private datePipe: DatePipe;
    constructor(http: Http) {
        super(http);
        this.datePipe = new DatePipe("en-US");
    }

    getAll() {
        return this.http.get(this.data_url + '/agme/cli', this.jwt()).map((response: Response) => response.json());
    }

    getByFilter(stats: string, startDate: Date, endDate: Date) {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();
        if (stats != "") {
            filter.append('v01000', stats);
        }
        let dateFormat = "yyyyMMddHHmmss";
        let sDateStr = this.datePipe.transform(startDate, dateFormat);
        let eDateStr = this.datePipe.transform(endDate, dateFormat);
        filter.append('observtime', '[' + sDateStr + ',' + eDateStr + ']');

        options.search = filter;

        return this.http.get(this.data_url + '/agme/cli/query', options).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.data_url + '/agme/cli/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post(this.data_url + '/agme/cli', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put(this.data_url + '/agme/cli/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        let d_options: RequestOptions = this.jwt();
        d_options.method = RequestMethod.Delete;
        return this.http.request(new Request({
            method: RequestMethod.Delete,
            url: this.data_url + '/agme/cli/' + id,
            headers: this.jwt().headers
        }))
    }

    getMonitorByFilter(areaCode: number, startDate: Date, endDate: Date) {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();

        filter.append('areaCode', areaCode.toString());
        filter.append('stimestamp', startDate.getTime().toString());
        filter.append('etimestamp', endDate.getTime().toString());

        options.search = filter;

        return this.http.get(this.data_url + '/agme/cli/monitor/getByArea', options).map((response: Response) => response.json());
    }

    getMonitorByDate(timestamp: number) {
        return this.http.get(this.data_url + '/agme/cli/monitor?timestamp=' + timestamp, this.jwt()).map((response: Response) => response.json());
    }

    getMonitorLastDate() {
        return this.http.get(this.data_url + '/agme/cli/monitor/lastDate', this.jwt()).map((response: Response) => response.json());
    }
}