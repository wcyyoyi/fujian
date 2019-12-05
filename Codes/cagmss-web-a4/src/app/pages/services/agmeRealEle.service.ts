import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { ApiService } from './api.service';
import { AgmeDist } from '../models/agmeDist';
import { AgmeRealEle } from '../models/agmeRealEle';

@Injectable()
export class AgmeRealEleService extends ApiService {

    constructor(http: Http) {
        super(http);
    }

    getByFilter(cUsername: string, cAreaCode: string, cCropCode: string, vdate: string) {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();

        filter.append('cUsername', cUsername);
        filter.append('cAreaCode', cAreaCode);
        filter.append('cCropCode', cCropCode);
        filter.append('vdate', vdate);

        options.search = filter;

        return this.http.get(this.data_url + '/real/ele/query', options).map((response: Response) => response.json());
    }

    create(agmeRealEle: AgmeRealEle) {
        return this.http.post(this.data_url + '/real/ele',
            agmeRealEle, this.jwt()).map((response: Response) => response.json());
    }

    update(agmeRealEle: AgmeRealEle) {
        return this.http.put(this.data_url + '/real/ele',
            agmeRealEle, this.jwt()).map((response: Response) => response.json());
    }

    getCodeByName(cCropCode, className = '数据要素') {
        let url = this.metas_url + '/agme/eles/name?name=' + cCropCode + '&className=' + className
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }


    getNameByCode(cCropCode, className = '数据要素') {
        let url = this.metas_url + '/agme/eles/code?code=' + cCropCode + '&className=' + className
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }

    getCropList() {
        let url = this.metas_url + '/agme/eles'
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
}