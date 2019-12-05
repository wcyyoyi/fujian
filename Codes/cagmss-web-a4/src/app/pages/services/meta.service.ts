import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class MetaService extends ApiService {
    constructor(http: Http) {
        super(http);
    }
    //获取资料
    getElement() {
        return this.http.get(this.metas_url + '/agme/eles', this.jwt()).map((response: Response) => response.json());
    }
    //根据区域编码查询子区域信息
    getChildrenData(cPCode: string) {
        return this.http.get(this.metas_url + '/dict/areas/cpcode/' + cPCode + '/children', this.jwt()).map((response: Response) => response.json());
    }
    //根据区域编码查询区域信息
    getAreaData(cPCode: string) {
        return this.http.get(this.metas_url + '/dict/areas/cpcode/' + cPCode, this.jwt()).map((response: Response) => response.json());
    }
    //获取系统目录等级枚举
    getSystemCatalogLevel() {
        return this.http.get(this.data_url + '/meteometas/enum/systemCatalogLevel', this.jwt()).map((response: Response) => response.json());
    }
}
