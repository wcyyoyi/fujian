import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class WarningService extends ApiService {
    constructor(http: Http) {
        super(http);
    }
    //根据条件查询预警信息
    getWarning(vend: number, vstart: number) {
        let url = this.data_url + '/agme/idxs/events/query?vend=' + vend + "&vstart=" + vstart;
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
    //修改预警信息
    updateWarning(obj) {
        let url = this.data_url + '/agme/idxs/events';
        return this.http.put(url, obj, this.jwt()).map((response: Response) => response.json());
    }
}
