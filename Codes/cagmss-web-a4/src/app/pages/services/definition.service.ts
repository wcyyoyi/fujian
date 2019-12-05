import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams, RequestMethod, Request } from '@angular/http';
import { ApiService } from './api.service'
import { MangStatSet } from '../models/definitions';
@Injectable()
export class DefinitionService extends ApiService {

    constructor(http: Http) {
        super(http);
    }
    getAllData() {
        let url = this.data_url + "/stat/set/getByUserId";
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }
    addOne(definition: MangStatSet) {
        let url = this.data_url + "/stat/set/create";
        return this.http.post(url, definition, this.jwt()).map((response: Response) => response.json());
    }
}