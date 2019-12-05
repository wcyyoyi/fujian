import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { ApiService } from './api.service';
import { AgmeDist } from '../models/agmeDist';

@Injectable()
export class FileUploadService extends ApiService {


    constructor(http: Http) {
        super(http);
    }

}
