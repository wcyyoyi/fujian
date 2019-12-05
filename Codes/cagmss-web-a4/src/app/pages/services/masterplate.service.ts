import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { ApiService } from './api.service'

@Injectable()
export class MasterplateService extends ApiService {

    constructor(http: Http) {
        super(http);
    }
    // 获取模板列表
    getAllTemlate(dataType: string, makeCompany: string) {
        return this.http.get(this.pro_url + '/prod/word/list/template?dataType=' + dataType + "&makeCompany=" + makeCompany, this.jwt()).map((response: Response) => response.json());
    }

    private dateReviver(key, value) {
        if (key === 'dEventtime') {
            return new Date(value);
        }
        return value;
    }

    private handleError(error: any): Promise<any> {
        console.error('IndexEventService an error occurred', error);
        return Promise.resolve(null);
    }
}