import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { ApiService } from './api.service';
import { AreaInfo } from '../models';

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
        return this.http.get(this.data_url + '/dict/areas', this.jwt())
            .map((response: Response) => response.json());
    }

    getByFilter(code: number, level: number = null): Promise<AreaInfo[]> {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();

        filter.append('cCode', code.toString() + '%');
        if (level) filter.append('vLevel', level.toString());

        options.search = filter;

        return this.http.get(this.data_url + '/dict/areas/query', options)
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }

    // getDeail(code): Promise<AreaInfo> {
    //     let url = this.data_url + '/dict/areas/cpcode/' + code;
    //     return this.http.get(encodeURI(url), this.jwt())
    //         .toPromise()
    //         .then((response: Response) => response.json());
    // }

    getDetailByCpcode(cPcode) {
        let url = this.data_url + '/dict/areas/cpcode/' + cPcode;
        return this.http.get(encodeURI(url), this.jwt()).map((response: Response) => response.json());
    }

    getChild(code) {
        let url = this.data_url + '/dict/areas/cpcode/' + code + '/childs';
        return this.http.get(encodeURI(url), this.jwt()).map((response: Response) => response.json());
    }

    getAreaChild(code) {
        let area = JSON.parse(localStorage.getItem('area'));
        if (code === area.detail.cPCode) {
            return area.child;
        }
        return null;
    }

    // getAreaParent(code) {
    //     // let url = this.data_url + '/dict/areas/parent/cpcode/' + cPCode;
    //     // return this.http.get(encodeURI(url), this.jwt()).map((response: Response) => response.json());
    //     let area = JSON.parse(localStorage.getItem('area'));
    //     if (code === area.detail.cPCode) {
    //         return area.detail;
    //     }
    //     for (let i = 0; i < area.child.length; i++) {
    //         if (code === area.child[i].cPCode) {
    //             return area.child[i].detail;
    //         }
    //     }
    //     return null;
    // }

    // getArea() {
    //     this.getDetail(this.makeCompany).subscribe(detail => {
    //         let obj = {
    //             detail: detail,
    //             child: []
    //         };
    //         this.getChild(this.makeCompany).subscribe(childList => {
    //             obj.child = childList;
    //             localStorage.setItem('area', JSON.stringify(obj));
    //         });
    //     });
    // }

    private handleError(error: any): Promise<any> {
        console.error('AreaService an error occurred', error);
        return Promise.resolve(null);
    }
}
