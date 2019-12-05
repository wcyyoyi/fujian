import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Http } from '@angular/http';

@Injectable()
export class DisasterService extends ApiService{

    constructor(http: Http) {
        super(http);
    }
}