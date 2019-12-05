import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { ApiService } from './api.service';
import { AgmeDist } from '../models/agmeDist';

@Injectable()
export class FileUploadService extends ApiService {


    constructor(http: Http) {
        super(http);
    }
    //获取所有图片（banner）列表
    getAllImgs() {
        let url = this.data_url + '/system/listALL/pic/banner';
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
    //根据level获取图片（banner）列表
    getImgsByLevel(levels: string) {
        let url = this.data_url + '/system/list/pic/banner?levels=' + levels;
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
    //上传图片（banner）到指定临时目录
    uploadImg(file, level: number) {
        let url = this.data_url + '/system/pic/banner/upload/' + level;
        return this.http.post(url, file, this.jwt()).map((response: Response) => response.json());
    }
    //删除图片
    deleteImg(name: string) {
        let url = this.data_url + '/system/pic/banner/delete?name=' + name;
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
}
