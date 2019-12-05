import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Http } from '@angular/http';

@Injectable()
export class DisasterService extends ApiService{

    constructor(http: Http) {
        super(http);
    }

    // getClassName(){
    //     let url=this.us_url+"/api/agme/eles/name?name="+ +"&className=数据要素";
    //     return this.http.post(url,currUser, this.jwt()).toPromise()
    //     .then((response: Response) => response.json())
    // }
}