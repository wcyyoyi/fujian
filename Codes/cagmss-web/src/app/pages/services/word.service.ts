import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class WordService extends ApiService {
    constructor(http: Http) {
        super(http);
    }

    getHtml(dataType, dataEleCode, date: Date) {
        let params = 'makeCompany=' + this.makeCompany + ',dataType=' + dataType
            + ',today=' + date.toLocaleDateString() + ',dataElementCode=' + dataEleCode;
        let url = this.data_url + '/prod/docx/getHtml?product=' + params;
        return this.http.get(url, this.jwt()).toPromise()
            .then(response => {
                return response.json();
            });
    }

    getHtmlBySaved(dataType, dataEleCode, date: Date) {
        let params = 'makeCompany=' + this.makeCompany + ',dataType=' + dataType
            + ',today=' + date.toLocaleDateString() + ',dataElementCode=' + dataEleCode;
        let url = this.data_url + '/prod/docx/getHtmlBySaved?product=' + params;
        return this.http.get(url, this.jwt()).toPromise()
            .then(response => {
                return response.text();
            });
    }

    isSaved(dataType, dataEleCode, date: Date) {
        let params = 'makeCompany=' + this.makeCompany + ',dataType=' + dataType
            + ',today=' + date.toLocaleDateString() + ',dataElementCode=' + dataEleCode;
        let url = this.data_url + '/prod/docx/isSaved?product=' + params;
        return this.http.get(url, this.jwt()).toPromise()
            .then(response => {
                return response.json();
            });
    }

    isIssued(dataType, dataEleCode, date: Date) {
        let params = 'makeCompany=' + this.makeCompany + ',dataType=' + dataType
            + ',today=' + date.toLocaleDateString() + ',dataElementCode=' + dataEleCode;
        let url = this.data_url + '/prod/docx/isIssued?product=' + params;
        return this.http.get(url, this.jwt()).toPromise()
            .then(response => {
                return response.json();
            });
    }

    save(htmlStr, dataType, dataEleCode, date: Date) {
        let params = 'makeCompany=' + this.makeCompany + ',dataType=' + dataType
            + ',today=' + date.toLocaleDateString() + ',dataElementCode=' + dataEleCode;
        let url = this.data_url + '/prod/docx/save?product=' + params;
        return this.http.post(url, htmlStr, this.jwt()).toPromise()
            .then(response => {
                return response.json();
            });
    }


    download(dataType, dataEleCode, date: Date) {
        let params = 'makeCompany=' + this.makeCompany + ',dataType=' + dataType
            + ',today=' + date.toLocaleDateString() + ',dataElementCode=' + dataEleCode;
        let url = this.data_url + '/prod/docx/download?product=' + params +
            '&access_token=' + this.getToken().access_token;
        return url;
    }

    issue(dataType, dataEleCode, date: Date) {
        let params = 'makeCompany=' + this.makeCompany + ',dataType=' + dataType
            + ',today=' + date.toLocaleDateString() + ',dataElementCode=' + dataEleCode;
        let url = this.data_url + '/prod/docx/issue?product=' + params;
        return this.http.get(url, this.jwt()).toPromise()
            .then(response => {
                return response.json();
            });
    }

    // getToken1() {
    //     return '?access_token=' + this.getToken().access_token;
    // }

    replaceHtml(html: string) {
        html = html.replace(/\?access_token=[0-9a-zA-Z\-]{36}/g, '?access_token=' + this.getToken().access_token);
        html = html.replace(/http:\/\/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))):\d{0,5}\/api/g,
            this.data_url);
        return html;
    }

}
