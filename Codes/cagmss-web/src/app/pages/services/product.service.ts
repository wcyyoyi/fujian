import { ApiService } from './api.service';
import { Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { ImageService } from '.';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProdService extends ImageService {
    private wordPoint: Subject<any> = new Subject<any>();
    private imgPoint: Subject<any> = new Subject<any>();


    constructor(http: Http) {
        super(http);
    }
    public setWordPoint(selectedPointsIfo: any): void {
        this.wordPoint.next(selectedPointsIfo);
    }
    public currentWordPoint(): Observable<any> {
        return this.wordPoint.asObservable();
    }

    public setImgPoint(selectedPointsIfo: any): void {
        this.imgPoint.next(selectedPointsIfo);
    }
    public currentImgPoint(): Observable<any> {
        return this.imgPoint.asObservable();
    }

    getMeta(makeCompany, dataType, dataEle, dataFormat) {
        let url = this.data_url + '/prod/imgs/metas?makeCompany=' + makeCompany
            + '&dataType=' + dataType + '&dataEle=' + dataEle + '&dataFormat=' + dataFormat;
        console.log(url);
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }

    getById(name: string) {
        return this.http.get(this.data_url + '/prod/imgs/' + name,
            this.jwt()).map((response: Response) => response.text());
    }

    // getAreaDetail(code) {
    //     let url = this.data_url + '/dict/areas/cpcode/' + code;
    //     return this.http.get(encodeURI(url), this.jwt()).map((response: Response) => response.json());
    // }

    // getAreaChild(code) {
    //     let url = this.data_url + '/dict/areas/cpcode/child/' + code;
    //     return this.http.get(encodeURI(url), this.jwt()).map((response: Response) => response.json());
    // }

    // getAreaParent(cPCode) {
    //     let url = this.data_url + '/dict/areas/parent/cpcode/' + cPCode;
    //     return this.http.get(encodeURI(url), this.jwt()).map((response: Response) => response.json());
    // }

    replaceHtml(html: string) {
        html = html.replace(/\?access_token=[0-9a-zA-Z\-]{36}/g, '?access_token=' + this.getToken().access_token);
        html = html.replace(/http:\/\/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))):\d{0,5}\/api/g,
        this.data_url);
        return html;
    }

    download(name: string) {
        return this.data_url + '/prod/docx/download/' + name + '?access_token=' + this.getToken().access_token;
    }

}
