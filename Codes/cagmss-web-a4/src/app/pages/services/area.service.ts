import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams, RequestMethod, Request } from '@angular/http';

import { ApiService } from './api.service';
import { AreaInfo } from '../models';
import { DictionaryService } from '../utils/Dictionary.service';

@Injectable()
export class AreaService extends ApiService {
    private _areas: AreaInfo[];

    get areas() {
        if (this._areas && this._areas.length > 0) {
            return Promise.resolve(this._areas);
        }
        else {
            let codeNum = Math.floor(+this.areaCode / 10000);
            return this.getByFilter(codeNum);
        }
    }

    constructor(http: Http) {
        super(http);
    }

    getAll() {
        return this.http.get(this.metas_url + '/dict/areas', this.jwt())
            .map((response: Response) => response.json());
    }

    getByFilter(code: number, level: number = null): Promise<AreaInfo[]> {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();

        filter.append('cCode', code.toString() + '%');
        if (level) filter.append('vLevel', level.toString());

        options.search = filter;

        return this.http.get(this.metas_url + '/dict/areas/query', options)
            .toPromise()
            .then((response: Response) => {
                this._areas = response.json();
                return response.json();
            })
            .catch(this.handleError);
    }

    getDetailByCpcode(code: string) {
        let url = this.metas_url + '/dict/areas/cpcode/' + code;
        return this.http.get(encodeURI(url), this.jwt()).map((response: Response) => response.json());
    }

    getParentByCCode(code: string, level: number) {
        let zero = '';
        for (let i = 0; i < (3 - level + 1) * 2; i++) {
            zero += '0';
        }
        let parentCode = code.toString().substring(0, (level - 1) * 2) + zero;
        return JSON.parse(localStorage.getItem('AREA')).find(area => area.cCode == parentCode);
    }

    getAreaParent(cpcode: string) {
        let url = this.metas_url + '/dict/areas/cpcode/' + cpcode + '/parent';
        return this.http.get(encodeURI(url), this.jwt()).map((response: Response) => response.json());
    }
    getAllChildren(cPCode) {
        let url = this.metas_url + '/dict/areas/cpcode/' + cPCode + "/allChildren";
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
    getCropsByCode(code) {
        let url = this.data_url + '/mang/cropstat/getByCCode?cCode=' + code;
        return this.http.get(encodeURI(url), this.jwt()).map((response: Response) => response.json());
    }
    //获取地区列表
    getArea() {
        let url = this.metas_url + '/dict/areas/query?vLevel=9'
        return this.http.get(url, this.jwt())
            .map((response: Response) => response.json());
    }
    clearCache() {
        let d_options: RequestOptions = this.jwt();
        d_options.method = RequestMethod.Delete;
        return this.http.request(new Request({
            method: RequestMethod.Delete,
            url: this.metas_url + '/dict/areas/deleteCache',
            headers: this.jwt().headers
        }))
    }
    createNewArea(values) {
        let url = this.metas_url + '/dict/areas';
        return this.http.post(url, values, this.jwt())
            .map((response: Response) => response.json());
    }
    private handleError(error: any): Promise<any> {
        console.error('AreaService an error occurred', error);
        return Promise.resolve(null);
    }
}
