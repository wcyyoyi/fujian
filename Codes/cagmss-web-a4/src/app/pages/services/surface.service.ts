import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams, RequestMethod, Request } from '@angular/http';
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

        let dateFormat = "yyyyMMdd000000";
        let sDateStr = this.datePipe.transform(startDate, dateFormat);
        let eDateStr = this.datePipe.transform(endDate, dateFormat);
        filter.append('vdate', '[' + sDateStr + ',' + eDateStr + ']');

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
        let d_options: RequestOptions = this.jwt();
        d_options.method = RequestMethod.Delete;
        return this.http.request(new Request({
            method: RequestMethod.Delete,
            url: this.data_url + '/surf/days/' + id,
            headers: this.jwt().headers
        }))
    }
    //连续查询
    serialSearch(vdate: string, velement: string, type: number, v01000: string) {
        let url = v01000 == "" ? this.data_url + '/surf/days/stat/' + type + '?velement=' + velement + "&vdate=" + vdate
            + "&groupby=v01000" : this.data_url + '/surf/days/stat/' + type + '?velement=' + velement + "&vdate=" + vdate + "&v01000=" + v01000 + "&groupby=v01000";
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
    //非连续查询
    unSerialSearch(velement: string, type: number, vsyear: string, veyear: string, vsmonthday: string, vemonthday: string, v01000: string) {
        let url = v01000 == "" ? this.data_url + '/surf/days/stat/section/' + type + '?velement=' + velement + "&vsyear=" + vsyear + "&veyear=" + veyear + "&vsmonthday=" + vsmonthday +
            "&vemonthday=" + vemonthday + "&groupby=v01000" : this.data_url + '/surf/days/stat/section/' + type + '?velement=' + velement + "&vsyear=" + vsyear + "&veyear=" + veyear + "&vsmonthday=" + vsmonthday + "&vemonthday=" + vemonthday + "&v01000=" + v01000 + "&groupby=v01000";
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }


    //常规统计连续查询
    conventionalSerial(vdate: string, velement: string, v01000: string) {
        let url = this.data_url + '/surf/days/stat?velement=' + velement + "&vdate=" + vdate + "&v01000=" + v01000 + "&groupby=v01000";
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
    // //常规统计非连续查询
    // conventionalUnSerial(velement: string, vsyear: string, veyear: string, vsmonthday: string, vemonthday: string, v01000: string) {
    //     let url = this.data_url + '/surf/days/stat/section?velement=' + velement + "&vsyear=" + vsyear + "&veyear=" + veyear + "&vsmonthday=" + vsmonthday + "&vemonthday=" + vemonthday + "&v01000=" + v01000 + "&groupby=v01000";
    //     return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    // }
    // //其它统计连续查询
    // UnConventionalSerial(vdate: string, velement: string, type: number) {
    //     let url = this.data_url + '/surf/days/stat/' + type + '?velement=' + velement + "&vdate=" + vdate + "&groupby=v01000";
    //     return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    // }
    // //其它统计非连续查询
    // UnConventionalUnSerial(velement: string, type: number, vsyear: string, veyear: string, vsmonthday: string, vemonthday: string) {
    //     let url = this.data_url + '/surf/days/stat/section/' + type + '?velement=' + velement + "&vsyear=" + vsyear + "&veyear=" + veyear + "&vsmonthday=" + vsmonthday + "&vemonthday=" + vemonthday + "&groupby=v01000";
    //     return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    // }

    createGrid(areaCode: number, statEle: string, startDate: Date, endDate: Date) {
        let url = this.data_url + '/surf/days/grids/' + areaCode + '/create';
        let params: URLSearchParams = new URLSearchParams();

        let dateFormat = "yyyyMMdd000000";
        let sDateStr = this.datePipe.transform(startDate, dateFormat);
        let eDateStr = this.datePipe.transform(endDate, dateFormat);

        params.append('vdate', '[' + sDateStr + ',' + eDateStr + ']');
        params.append('velement', statEle);

        url += '?access_token=' + this.getToken().access_token + '&' + params.toString();

        return url;
    }

    private handleError(error: any): Promise<any> {
        console.error('SurfaceService an error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}