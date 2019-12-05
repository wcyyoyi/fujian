import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams, RequestMethod, Request } from '@angular/http';

import { ApiService } from './api.service'

@Injectable()
export class BookMarkService extends ApiService {
    constructor(http: Http) {
        super(http);
    }
    //获取所有书签
    getAllMarks() {
        let url = this.pro_url + "/prod/word/bookmark/all";
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
    //根据模版获取书签
    getMarkByTemplate(dataElementCode: string, dataType: string, makeCompany: string) {
        let url = this.pro_url + "/prod/word/bookmark?dataElementCode=" + dataElementCode + "&dataType=" + dataType + "&makeCompany=" + makeCompany;
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
    //创建书签
    createBookMark(bookMarkType: number, content, desc: string, tempType: number) {
        let url = this.pro_url + "/prod/word/bookmark?bookMarkType=" + bookMarkType + "&desc=" + desc + "&tempType=" + tempType;
        return this.http.post(url, content, this.jwt()).map((response: Response) => response.json());
    }
    //修改书签
    updateBookMark(content) {
        let url = this.pro_url + "/prod/word/bookmark";
        return this.http.put(url, content, this.jwt()).map((response: Response) => response.json());
    }
    //删除书签
    deleteBookMark(id: number) {
        let d_options: RequestOptions = this.jwt();
        d_options.method = RequestMethod.Delete;
        return this.http.request(new Request({
            method: RequestMethod.Delete,
            url: this.pro_url + "/prod/word/bookmark/" + id,
            headers: this.jwt().headers
        }))
    }
    //模板数据添加书签
    addMarkToTemplate(bookmarkIds, tempId) {
        let url = this.pro_url + "/prod/word/bookmark/addToTemp?tempId=" + tempId;
        return this.http.post(url, bookmarkIds, this.jwt()).map((response: Response) => response.json());
    }
    //获取书签类型枚举
    getBookMarkList() {
        let url = this.data_url + "/meteometas/enum/bookMarkType";
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
    //根据id获取书签
    getBookMarkById(id:number){
        let url = this.pro_url + "/prod/word/bookmark/"+id;
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
    private handleError(error: any): Promise<any> {
        console.error('YieldService an error occurred', error);
        return Promise.resolve(null);
    }
}