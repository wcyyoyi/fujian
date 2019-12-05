import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class WordService extends ApiService {
    constructor(http: Http) {
        super(http);
    }

    getNewHtml(dataType, dataEleCode, productDate: string) {
        let url = this.pro_url + '/prod/word/getHtml?' + this.baseParamsStr(dataType, dataEleCode, productDate);

        // let url = this.pro_url + '/prod/word/getHtml?dataElementCode=MONT&dataType=WCRM&makeCompany=BEFZ&productDate=20190101000000';
        return this.http.get(url, this.jwt()).toPromise()
            .then(response => {
                let data = response.text();
                data = data.replace(/\[\$service_ip\]/g, this.pro_url);
                return data;
            });
    }
    getHtmlByName(key) {
        let url = this.pro_url + '/prod/word/template?key=' + key;
        return this.http.get(url, this.jwt()).toPromise()
            .then(response => {
                let data = response.text();
                data = data.replace(/\[\$service_ip\]/g, this.pro_url);
                return data;
            });
    }
    //保存模版
    saveTemplate(dataElementCode: string, dataType: string, htmlCode, makeCompany: string, productDate: string) {
        let params = 'dataElementCode=' + dataElementCode + '&dataType=' + dataType
            + '&makeCompany=' + makeCompany + '&productDate=' + productDate;
        let url = this.pro_url + '/prod/word/template?' + params;
        return this.http.put(url, htmlCode, this.jwt()).toPromise()
            .then(response => {
                return response.json();
            });
    }
    //保存关注内容
    saveAttention(content, dataElementCode: string, dataType: string, makeCompany: string) {
        let url = this.pro_url + '/prod/word/saveAttention?'
        let param = "dataElementCode=" + dataElementCode + "&dataType=" + dataType + "&makeCompany=" + makeCompany;
        return this.http.put(url + param, content, this.jwt()).toPromise()
            .then(response => {
                return response.json();
            });
    }
    //保存关注内容
    saveAttentionByPosition(positions, dataElementCode: string, dataType: string, makeCompany: string, productDate: string) {
        let url = this.pro_url + '/prod/word/saveAttentionByPosition?'
        let param = "dataElementCode=" + dataElementCode + "&dataType=" + dataType + "&makeCompany=" + makeCompany + "&productDate=" + productDate;
        return this.http.put(url + param, positions, this.jwt()).toPromise()
            .then(response => {
                return response.json();
            });
    }
    //获取关注内容
    getAttention(dataElementCode: string, dataType: string, makeCompany: string) {
        let url = this.pro_url + '/prod/word/saveAttention?'
        let param = "dataElementCode=" + dataElementCode + "&dataType=" + dataType + "&makeCompany=" + makeCompany;
        return this.http.get(url + param, this.jwt()).map((response: Response) => response.text());

    }
    //模版获取书签
    getBookMark(dataElementCode: string, dataType: string, makeCompany: string){
        let url = this.pro_url + '/prod/word/bookmark?'
        let param = "dataElementCode=" + dataElementCode + "&dataType=" + dataType + "&makeCompany=" + makeCompany;
        return this.http.get(url + param, this.jwt()).map((response: Response) => response.json());
    }
    deleteHtml(makeCompany: string, dataType: string, dataEleCode: string, date: string) {
        let params = 'dataElementCode=' + dataEleCode + '&dataType=' + dataType
            + '&makeCompany=' + makeCompany + '&productDate=' + date;
        let url = this.pro_url + '/prod/word/deleteTemplate?' + params;
        return this.http.get(url, this.jwt()).toPromise()
            .then(response => {
                return response.text();
            });
    }
    getHtmlBySaved(dataType, dataEleCode, productDate: string) {
        let url = this.pro_url + '/prod/word/getHtmlBySave?' + this.baseParamsStr(dataType, dataEleCode, productDate);
        return this.http.get(url, this.jwt()).toPromise()
            .then(response => {
                let data = response.text();
                data = data.replace(/\[\$service_ip\]/g, this.pro_url);
                return data;
            });
    }

    getHtmlByIssue(dataType, dataEleCode, productDate: string) {
        let url = this.pro_url + '/prod/word/getHtmlByIssue?' + this.baseParamsStr(dataType, dataEleCode, productDate);
        return this.http.get(url, this.jwt()).toPromise()
            .then(response => {
                let data = response.text();
                data = data.replace(/\[\$service_ip\]/g, this.pro_url);
                return data;
            });
    }

    isSaved(dataType, dataEleCode, productDate: string) {
        let url = this.pro_url + '/prod/word/isSave?' + this.baseParamsStr(dataType, dataEleCode, productDate);
        return this.http.get(url, this.jwt()).toPromise()
            .then(response => {
                return response.json();
            });
    }

    isIssued(dataType, dataEleCode, productDate: string) {
        let url = this.pro_url + '/prod/word/isIssue?' + this.baseParamsStr(dataType, dataEleCode, productDate);
        return this.http.get(url, this.jwt()).toPromise()
            .then(response => {
                return response.json();
            });
    }

    downloadBySave(dataType, dataEleCode, productDate: string) {
        let url = this.pro_url + '/prod/word/downloadBySave?' + this.baseParamsStr(dataType, dataEleCode, productDate) +
            '&access_token=' + this.getToken().access_token;
        return url;
    }

    downloadByIssue(dataType, dataEleCode, productDate: string) {
        let url = this.pro_url + '/prod/word/downloadByIssue?' + this.baseParamsStr(dataType, dataEleCode, productDate) +
            '&access_token=' + this.getToken().access_token;
        return url;
    }

    deleteSaved(dataType, dataEleCode, productDate: string) {
        let url = this.pro_url + '/prod/word/deleteSaved?' + this.baseParamsStr(dataType, dataEleCode, productDate);
        return this.http.get(url, this.jwt()).toPromise()
            .then(response => {
                return response.json();
            });
    }

    save(htmlStr, dataType, dataEleCode, productDate: string) {
        let url = this.pro_url + '/prod/word/save?' + this.baseParamsStr(dataType, dataEleCode, productDate);
        return this.http.put(url, htmlStr, this.jwt()).toPromise()
            .then(response => {
                return response.json();
            });
    }

    issue(dataType, dataEleCode, productDate: string) {
        let url = this.pro_url + '/prod/word/issue?' + this.baseParamsStr(dataType, dataEleCode, productDate);
        return this.http.get(url, this.jwt()).toPromise()
            .then(response => {
                return response.json();
            });
    }

    private baseParamsStr(dataType, dataEleCode, productDate: string): string {
        // let month = date.getMonth() + 1;
        // let day = date.getDate();
        // let dateStr = date.getFullYear() + (month >= 10 ? month.toString() : "0" + month) + (day >= 10 ? day.toString() : "0" + day) + "000000";
        let params = 'makeCompany=' + this.makeCompany + '&dataType=' + dataType
            + '&productDate=' + productDate + '&dataElementCode=' + dataEleCode;
        return params;
    }
}
