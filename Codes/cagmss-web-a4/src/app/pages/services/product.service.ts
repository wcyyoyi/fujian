import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { ImageService } from '.';

@Injectable()
export class ProdService extends ImageService {
    constructor(http: Http) {
        super(http);
    }
    //查询产品名称列表
    getProdList(makeCompany, dataType, dataEle, dataFormat, resolution = '.*') {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();
        filter.append('makeCompany', makeCompany);
        filter.append('dataType', dataType);
        filter.append('dataFormat', dataFormat);
        filter.append('dataEle', dataEle);
        filter.append('resolution', resolution);
        options.search = filter;
        return this.http.get(this.pro_url + '/product/query', options).map((response: Response) => response.json());
    }
    getCsvData(fileName: string) {
        let url = this.pro_url + '/product/' + fileName;
        return this.http.get(url, this.jwt()).map((response: Response) => response.text());
    }
    //查询产品信息列表
    getMeta(makeCompany, dataType, dataEle, dataFormat) {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();
        filter.append('makeCompany', makeCompany);
        filter.append('dataType', dataType);
        filter.append('dataFormat', dataFormat);
        filter.append('dataEle', dataEle);
        options.search = filter;
        return this.http.get(this.pro_url + '/product/metas/query', options).map((response: Response) => response.json());
    }
    //根据产品名称获取信息列表
    getMetaByKey(fileName: string) {
        let url = this.pro_url + '/product/metas/getByKey?key=' + fileName
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
    replaceHtml(html: string) {
        html = html.replace(/\?access_token=[0-9a-zA-Z\-]{36}/g, '?access_token=' + this.getToken().access_token);
        html = html.replace(/http:\/\/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))):\d{0,5}\/api/g,
            this.data_url);
        html = html.replace(/http:\/\/localhost:[0-9]{0,5}\/api/g, this.data_url);
        return html;
    }
    
    //拼接图片或者文件地址
    getUrl(name: string) {
        return this.pro_url + '/product/' + name + '?access_token=' + this.getToken().access_token;
    }
    //获取图片缩略图
    getThumbnail(fileName){
        return this.pro_url + '/product/thumbnail/' + fileName + '?access_token=' + this.getToken().access_token;
    }
    //获取时间要素列表
    getDateElement() {
        let url = this.getWebUrl() + '/assets/dateElement/dateElement.json'
        return this.http.get(url).map((response: Response) => response.json());
    }
    //获取产品选择列表
    getProductList() {
        let url = this.getWebUrl() + '/assets/product/product.json'
        return this.http.get(url).map((response: Response) => response.json());
    }
}
